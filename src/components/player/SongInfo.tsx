import { useContext, useEffect, useState } from "react";
import styles from "@/components/player/SongInfo.module.css"
import Image from "next/image";
import { PlayerContext, PlayerContextProps } from "@/components/player/Player";
import { AudioContext } from "@/components/player/AudioContext";
import { AudioContextProps } from "@/components/player/AudioContext";
import Link from "next/link";
import { Artist } from "@/pages/api/artist";

export function SongInfo() {
    const player = useContext(PlayerContext);
    const audio = useContext(AudioContext);

    return (
        <div className={styles.songInfo}>
            <Cover player={player} />
            <SongProgress player={player} audio={audio} />
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
                alt="Cover"
            />
        </div>
    )
}

type BannerProps = {
    audio: AudioContextProps,
    player: PlayerContextProps
}

function SongProgress(props: BannerProps) {
    const audio = props.audio;
    const player = props.player;

    let artists: Artist[] | undefined;
    if (player.currentTrack()?.artists !== undefined) {
        artists = player.currentTrack()?.artists;
    }

    return (
        <div className={styles.songProgress}>
            <SongName player={player} />
            <ArtistList
                artists={artists}
                fontSize={"x-small"}
                // fontWeight={"light"}
                color="#bbbbbb"
            />
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

type ArtistListProps = {
    artists: Artist[] | undefined,
    fontSize: string,
    // fontWeight: string,
    color: string
}

export function ArtistList(props: ArtistListProps) {
    const artists = props.artists;
    const fontSize = props.fontSize;
    // const fontWeight = props.fontWeight;
    const color = props.color;

    let artistList;
    if (artists !== undefined) {
        artistList = artists.map((artist, index) => {
            return (
                <span key={artist.name}>
                    <Link href={"/artist/" + artist.ID}
                        style={{
                            fontSize: fontSize,
                            // fontWeight: fontWeight,
                            color: color,
                        }}
                        onMouseEnter={() => {

                        }}
                    >
                        {artist.name}
                    </Link>
                    {index !== artists.length - 1 ?
                        <span style={{
                            fontSize: fontSize,
                            color: color
                        }} >{"· "}</span> :
                        <></>
                    }
                </span >
            );
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