import { useEffect, useState } from "react";
import styles from "./LoginPane.module.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { LoginProps } from "@/layouts/Aside";
import instance, { Base } from "@/util/axios";
import Image from "next/image";

export function LoginPane(props: LoginProps) {
    const login = props.login;

    return (
        <div className={styles.background}>
            <div className={styles.loginPane}>
                <CloseButton login={login} />
                <span className={styles.desc}>
                    扫描二维码登录
                </span>
                <QRCode />
            </div>
        </div>
    )
}

function QRCode() {
    const axios = instance(Base.IN);
    const [code, setCode] = useState("");

    const generateQRCode = async () => {
        setCode(await axios.get("/api/login"));
    }

    useEffect(() => {
        console.log("generate qr code");
        generateQRCode();
    }, []);

    return (
        <div className={styles.QRCode}>
            <Image
                src={code ? code : "https://via.placeholder.com/200x200"}
                width={200}
                height={200}
                alt="QRCode"
            />
        </div>
    )
}

function CloseButton(props: LoginProps) {
    const login = props.login;

    return (
        <div
            className={styles.closeButton}
            onClick={() => {
                login.setOpenLoginPane(false);
            }}
        >
            <CloseRoundedIcon htmlColor="#969696" />
        </div>
    )
}

