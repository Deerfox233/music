import { useContext } from "react";
import styles from "./ProgressBar.module.css"
import Image from "next/image";
import { PlayerContext, PlayerContextProps } from "./Player";

export function ProgressBar() {
    const player = useContext(PlayerContext);

    return (
        <div className={styles.progressBar}>
            <Cover player={player} />
            <Banner player={player} />
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

function Banner(props: PlayerAsProp) {
    const player = props.player;

    return (
        <div className={styles.banner}>
            <SongName player={player} />
            <ArtistList player={player} />
        </div>
    )
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