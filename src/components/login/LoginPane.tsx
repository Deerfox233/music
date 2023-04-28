import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./LoginPane.module.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { LoginProps, Logo } from "@/layouts/Aside";
import instance, { Base } from "@/util/axios";
import Image from "next/image";

const timerIDs: NodeJS.Timer[] = [];

export function LoginPane(props: LoginProps) {
    const login = props.login;
    const [loading, setLoading] = useState(true);

    return (
        <div className={styles.background}>
            <div className={styles.loginPane}>
                {loading === false ? <CloseButton login={login} /> : <></>}
                <span className={styles.desc}>
                    <Logo size={30} color={"#222222"} />
                </span>
                <QRCode setLoading={setLoading} />
            </div>
        </div>
    )
}

function QRCode(props: { setLoading: Dispatch<SetStateAction<boolean>> }) {
    const axios = instance(Base.IN);
    const [code, setCode] = useState("");
    const [key, setKey] = useState("");
    const [status, setStatus] = useState("");

    const generateQRCode = async () => {
        const codeDetail: {
            code: string,
            key: string
        } = await axios.get("/api/login");
        setCode(codeDetail.code);
        //test
        setKey(codeDetail.key);

        return codeDetail.key;
    }

    useEffect(() => {
        const axios = instance(Base.EX);

        const checkQRStatus = async (key: string) => {
            console.log("check key ", key);
            const timestamp = Date.now();
            const status: {
                code: number,
                message: string,
                cookie: string
            } = await axios.get("login/qr/check", {
                params: {
                    key,
                    timestamp
                }
            });

            return status;
        }

        const checkLoginStatus = async (cookie: string) => {
            console.log("check login status");
            const timestamp = Date.now();
            const status = await axios.get("login/status", {
                params: {
                    cookie,
                    timestamp
                }
            });

            return status;
        }

        generateQRCode().then(key => {
            timerIDs.push(setInterval(async () => {
                checkQRStatus(key).then(async status => {
                    props.setLoading(false);
                    for (let i = 0; i < timerIDs.length - 1; i++) {
                        clearInterval(timerIDs[i]);
                    }
                    setStatus(status.message);
                    console.log(status);
                    if (status.code === 803) {          // 验证成功操作
                        clearInterval(timerIDs[timerIDs.length - 1]);
                        localStorage.setItem("loginCookie", status.cookie);
                        const loginState = await checkLoginStatus(status.cookie);
                        console.log(loginState);
                    }
                });
            }, 2000));
        });
    }, []);

    return (
        <>
            <div className={styles.QRCode}>
                <Image
                    src={code ? code : "https://via.placeholder.com/200x200"}
                    width={200}
                    height={200}
                    alt="QRCode"
                />
            </div>
            <span style={{
                position: "fixed",
                bottom: "125px",
                color: "#222222",
                fontWeight: "bold"
            }}>
                {status}
            </span>
            <span style={{
                position: "fixed",
                bottom: "80px",
                color: "#555555",
            }}>
                {key}
            </span>
        </>
    )
}

function CloseButton(props: LoginProps) {
    const login = props.login;

    return (
        <div
            className={styles.closeButton}
            onClick={() => {
                login.setOpenLoginPane(false);
                timerIDs.forEach(timerID => {
                    clearInterval(timerID);
                });
                timerIDs.length = 0;
            }}
        >
            <CloseRoundedIcon htmlColor="#969696" />
        </div>
    )
}

