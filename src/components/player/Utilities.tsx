import { useContext, useState } from "react";
import styles from "./Utilities.module.css";
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import { AudioContext, AudioContextProps } from "./AudioContext";
import Playlist from "./Playlist";
import { PlayerContext, PlayerContextProps } from "./Player";
import instance, { Base } from "@/util/axios";
import { UserContext } from "@/components/login/UserContext";

export function Utilities() {
    const audio = useContext(AudioContext);
    const player = useContext(PlayerContext);

    return (
        <div className={styles.utilities}>
            <VolumeBar audio={audio} />
            <PlaylistButton player={player} />
        </div>
    );
}


type VolumeBarProps = {
    audio: AudioContextProps,
}

function VolumeBar(props: VolumeBarProps) {
    const [volume, setVolume] = useState(0);
    const audio = props.audio;

    function handleVolumeChange(e: any) {
        setVolume(Number(e.target.value));
        audio.setVolume(volume);
    }

    return (
        <div className={styles.volumeBar}>
            <VolumeUpRoundedIcon htmlColor="#b3b3b3" />
            <input
                className={styles.volumeRange}
                type="range"
                defaultValue={100}
                onMouseMove={e => handleVolumeChange(e)}
            />
        </div>
    );
}

type PlaylistButtonProps = {
    player: PlayerContextProps
}

function PlaylistButton(props: PlaylistButtonProps) {
    const [isListDisplayed, setListDisplayed] = useState(false);
    const player = props.player;

    //test
    const user = useContext(UserContext);

    return (
        <div className={styles.playlistButton}>
            <div
                onClick={async () => {
                    setListDisplayed(!isListDisplayed);
                    //test
                    // await player.initPlaylistByID("7396274610", 0);


                }}
            >
                <QueueMusicRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 30 }} />
            </div>
            {isListDisplayed ? <Playlist /> : <></>}
        </div>
    )
}