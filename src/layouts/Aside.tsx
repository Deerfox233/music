import styles from "./Aside.module.css"
import Image from "next/image";
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import PianoRoundedIcon from '@mui/icons-material/PianoRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import NightlifeRoundedIcon from '@mui/icons-material/NightlifeRounded';
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';
import { SetStateAction, useState, Dispatch, useContext, useEffect } from "react";
import { LoginPane } from "@/components/login/LoginPane";
import { UserContext, UserContextProps } from "@/components/login/UserContext";
import Link from "next/link";
import { Profile } from "@/pages/api/user";
import instance, { Base } from "@/util/axios";
import { Playlist } from "@/pages/api/playlist";

const axios = instance(Base.IN);

export function Aside() {
    const user = useContext(UserContext);
    const [openLoginPane, setOpenLoginPane] = useState(false);
    const login = { openLoginPane, setOpenLoginPane };
    const [playlists, setPlaylists] = useState([] as Playlist[]);

    const fetchUserInfo = async (cookie: string) => {
        const profile: Profile | null = await axios.get("api/user", {
            params: {
                cookie,
            }
        });
        return profile;
    }

    const fetchPlaylists = async (userID: string) => {
        let playlists: Playlist[] = [];

        await axios.get<any, []>("/api/playlist/user", {
            params: {
                uid: userID
            }
        }).then((rawPlaylists: {
            id: string,
            name: string,
            coverImgUrl: string,
        }[]) => {
            playlists = rawPlaylists.map(rawPlaylist => {
                return new Playlist(rawPlaylist.id, rawPlaylist.name, rawPlaylist.coverImgUrl);
            });
        });

        return playlists;
    }

    useEffect(() => {
        const cookie: string = localStorage.getItem("cookie") as string;

        // 初始化用户信息
        fetchUserInfo(cookie).then(async profile => {
            user.setProfile(profile);
            setPlaylists(await fetchPlaylists(profile?.userId!));
        });
    }, []);

    return (
        <div className={styles.aside}>
            <Logo size={20} color="#eeeeee" />
            <SearchBar />
            <PlaylistAside playlists={playlists} />
            <AccountCard login={login} />
            {openLoginPane ? <LoginPane login={login} /> : <></>}
        </div>
    );
}

export type LoginProps = {
    login: {
        openLoginPane: boolean,
        setOpenLoginPane: Dispatch<SetStateAction<boolean>>
    },
}

function AccountCard(props: LoginProps) {
    const login = props.login;
    const user = useContext(UserContext);

    const profile = user.profile;

    return (
        <div className={styles.accountCard}>
            <Link href={"/user/" + profile?.userId}>
                <Avatar profile={profile} size={30} />
            </Link>
            <Username login={login} />
        </div>
    )
}

export function Avatar(props: {
    profile: Profile | undefined | null,
    size: number
}) {

    return (
        <div className={styles.avatar} style={{ width: props.size, height: props.size }}>
            <Image
                style={{ borderRadius: props.size / 2 }}
                width={props.size}
                height={props.size}
                src={props.profile?.avatarUrl ? props.profile.avatarUrl : "/test.png"}
                alt="Avatar"

                onClick={() => {
                    console.log(props.profile);
                }}
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

export function Logo(props: { size: number, color: string }) {
    const size = props.size;
    const color = props.color;

    return (
        <Link href="/">
            <div className={styles.logo}>
                <NightlifeRoundedIcon htmlColor={color} style={{ fontSize: size }} />
                <AlbumRoundedIcon htmlColor={color} style={{ fontSize: size }} />
                <HeadphonesRoundedIcon htmlColor={color} style={{ fontSize: size }} />
                <EqualizerRoundedIcon htmlColor={color} style={{ fontSize: size }} />
                <PianoRoundedIcon htmlColor={color} style={{ fontSize: size }} />
                <MusicNoteRoundedIcon htmlColor={color} style={{ fontSize: size }} />
            </div>
        </Link>
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

function PlaylistAside(props: { playlists: Playlist[] }) {
    const playlists = props.playlists;

    return (
        <div className={styles.playlistAside}>
            <div className={styles.myPlaylists}>
                我的歌单
            </div>
            {
                playlists.map(playlist => {
                    return (
                        <span key={playlist.ID}>
                            <PlaylistItem playlist={playlist} />
                        </span>
                    );
                })
            }
        </div>
    )
}

function PlaylistItem(props: { playlist: Playlist }) {
    const [color, setColor] = useState("#3b3b3b00");

    return (
        <Link href={"/playlist/" + props.playlist.ID}>
            <div className={styles.playlistItem}
                style={{
                    backgroundColor: color
                }}
                onMouseEnter={() => {
                    setColor("#3b3b3b");
                }}
                onMouseLeave={() => {
                    setColor("#3b3b3b00");
                }}
            >
                <span className={styles.playlistName}>
                    {props.playlist.name}
                </span>
            </div>
        </Link>
    )
}