import styles from "./Playback.module.css"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import { useContext, useEffect, useState } from "react";
import { AudioContext, AudioContextProps } from "./AudioContext";
import { PlayerContext, PlayerContextProps } from "./Player";

export function Playback() {
    const audio = useContext(AudioContext);
    const player = useContext(PlayerContext);

    return (
        <div className={styles.main}>
            <div className={styles.playback}>
                <PreviousButton audio={audio} player={player} />
                <PlayButton audio={audio} player={player} />
                <NextButton audio={audio} player={player} />
            </div>
        </div>
    );
}

type ButtonProps = {
    audio: AudioContextProps,
    player: PlayerContextProps
}

function PlayButton(props: ButtonProps) {
    const [paused, setPaused] = useState(true);
    const audio = props.audio;
    const player = props.player;

    audio.addPauseListener(() => {
        setPaused(true);
    });

    audio.addPlayListener(() => {
        setPaused(false);
    });

    useEffect(() => {
        const listener = async () => {
            await player.nextSong();
        }
        player.addEndedListener(listener);
        return (() => {
            player.removeEndedListener(listener);
        })
    }, [player]);

    return (
        <div
            className={styles.playButton}
            onClick={() => {
                if (audio.isPaused() === false) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }}
        >
            {
                paused ?
                    <PlayArrowRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 35 }} /> :
                    <PauseRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 35 }} />
            }
        </div>
    );
}

function PreviousButton(props: ButtonProps) {
    const audio = props.audio;
    const player = props.player;

    return (
        <div className={styles.previousButton}
            onClick={async () => {
                console.log("previous song button");

                await player.previousSong();
            }}
        >
            <SkipPreviousRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 30 }} />
        </div>
    )
}

function NextButton(props: ButtonProps) {
    const audio = props.audio;
    const player = props.player;

    return (
        <div className={styles.nextButton}
            onClick={async () => {
                console.log("next song button");

                await player.nextSong();
            }}
        >
            <SkipNextRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 30 }} />
        </div>
    )
}