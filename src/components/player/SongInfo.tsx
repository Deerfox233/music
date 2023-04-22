import { useContext, useEffect, useState } from "react";
import styles from "./SongInfo.module.css"
import Image from "next/image";
import { PlayerContext, PlayerContextProps } from "./Player";
import { AudioContext } from "./AudioContext";
import { AudioContextProps } from "./AudioContext";

export function SongInfo() {
    const player = useContext(PlayerContext);
    const audio = useContext(AudioContext);

    return (
        <div className={styles.songInfo}>
            <Cover player={player} />
            <Banner player={player} audio={audio} />
        </div>
    );
}

type PlayerAsProp = {
    player: PlayerContextProps
}

function Cover(props: PlayerAsProp) {
    const player = props.player;

    return (
        <div className={styles.cover}>
            <Image
                width={47}
                height={47}
                src={player.currentTrack() ? player.currentTrack()?.coverUrl! : "https://via.placeholder.com/47x47"}
                alt="Cover" />
        </div>
    )
}

type BannerProps = {
    audio: AudioContextProps,
    player: PlayerContextProps
}

function Banner(props: BannerProps) {
    const audio = props.audio;
    const player = props.player;

    return (
        <div className={styles.banner}>
            <SongName player={player} />
            <ArtistList player={player} />
            {player.currentTrack() ? <ProgressBar player={player} audio={audio} /> : <></>}
        </div>
    )
}

type ProgressBarProps = BannerProps;

function ProgressBar(props: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const audio = props.audio;

    const [mounted, setMounted] = useState(true);
    const [cleaned, setCleaned] = useState(true);

    const timeupdateHandler = () => {
        if (audio.getDuration()) {
            setProgress((audio.getCurrentTime() / audio.getDuration()) * 100);
        }
    }

    useEffect(() => {
        if (mounted) {
            audio.addTimeUpdateListener(timeupdateHandler);
        }
        return (() => {
            audio.removeTimeUpdateListener(timeupdateHandler);
        })
    }, [mounted, cleaned]);

    return (
        <div className={styles.progressBar}>
            <input
                className={styles.progressRange}
                type="range"
                value={progress}
                onChange={(e) => {
                    setProgress(Number(e.target.value));
                    setCleaned(!cleaned);
                }}
                onMouseDown={() => {
                    setMounted(false);
                }}
                onMouseUp={() => {
                    setMounted(true);
                    audio.setCurrentTime((progress / 100) * audio.getDuration());
                }}
            />
        </div>
    );
}

function SongName(props: PlayerAsProp) {
    const player = props.player;

    return (
        <div className={styles.songName} >
            {player.currentTrack() ? player.currentTrack()?.name : <br />}
        </div >
    )
}

function ArtistList(props: PlayerAsProp) {
    const player = props.player;

    let artistList;
    if (player.currentTrack() !== undefined) {
        artistList = player.currentTrack()!.artist!.map((artist, index) => {
            return (
                <span key={artist.name}>
                    <a href={artist.name}
                        className={styles.artistName}>
                        {artist.name}
                    </a>
                    {index !== player.currentTrack()!.artist!.length - 1 ?
                        <span className={styles.artistName}>{"· "}</span> :
                        <></>
                    }
                </span >
            )
        });
    } else {
        artistList = (<br />);
    }

    return (
        <div className={styles.artistList}>
            {artistList}
        </div>
    );
}