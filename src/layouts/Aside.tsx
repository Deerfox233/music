import styles from "./Aside.module.css"
import Image from "next/image";
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import PianoRoundedIcon from '@mui/icons-material/PianoRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import NightlifeRoundedIcon from '@mui/icons-material/NightlifeRounded';
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';
import { SetStateAction, useState, Dispatch } from "react";
import { LoginPane } from "@/components/login/LoginPane";

export function Aside() {
    const [openLoginPane, setOpenLoginPane] = useState(false);
    const login = { openLoginPane, setOpenLoginPane };

    return (
        <div className={styles.aside}>
            <Logo />
            <SearchBar />
            <AccountCard login={login} />
            {openLoginPane ? <LoginPane login={login} /> : <></>}
        </div>
    );
}

export type LoginProps = {
    login: {
        openLoginPane: boolean,
        setOpenLoginPane: Dispatch<SetStateAction<boolean>>
    }
}

function AccountCard(props: LoginProps) {
    const login = props.login;

    return (
        <div className={styles.accountCard}>
            <Avatar />
            <Username login={login} />
        </div>
    )
}

function Avatar() {
    return (
        <div className={styles.avatar}>
            <Image
                style={{ clipPath: "circle(50% at 50% 50%)" }}
                width={30}
                height={30}
                src="/test.png"
                alt="Avatar"
            />
        </div>
    );
}

function Username(props: LoginProps) {
    const login = props.login;

    return (
        <div className={styles.username}>
            <LoginButton login={login} />
        </div>
    )
}

//test
function LoginButton(props: LoginProps) {
    const login = props.login;

    return (
        <div
            className={styles.loginButton}
            onClick={() => {
                login.setOpenLoginPane(true);
            }}
        >
            登录
        </div>
    )
}

function Logo() {
    return (
        <div className={styles.logo}>
            <NightlifeRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
            <AlbumRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
            <HeadphonesRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
            <EqualizerRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
            <PianoRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
            <MusicNoteRoundedIcon htmlColor="#eeeeee" style={{ fontSize: 20 }} />
        </div>
    );
}

function SearchBar() {
    const [keywords, setKeywords] = useState("");

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                className={styles.input}
                placeholder="搜索"
                value={keywords}
                onChange={(e) => {
                    setKeywords(e.target.value);
                }}
            />
        </div>
    );
}

