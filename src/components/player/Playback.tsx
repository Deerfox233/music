import styles from "./Playback.module.css"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { useContext, useEffect, useState } from "react";
import { AudioContext, AudioContextProps } from "@/components/player/AudioContext";
import { PlayerContext, PlayerContextProps } from "@/components/player/Player";

export function Playback() {
    const audio = useContext(AudioContext);
    const player = useContext(PlayerContext);


    useEffect(() => {
        const handleSpaceDown = (e) => {
            if (e.code === "Space") {
                // console.log("space");
                if (audio.isPaused()) {
                    audio.play();
                } else {
                    audio.pause();
                }
            }
        }

        document.addEventListener("keydown", handleSpaceDown);

        return () => {
            document.removeEventListener("keydown", handleSpaceDown);
        }
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.playback}
            >
                <RandomButton />
                <PreviousButton audio={audio} player={player} />
                <PlayButton audio={audio} player={player} />
                <NextButton audio={audio} player={player} />
                <LoopButton />
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

    useEffect(() => {
        audio.addPauseListener(() => {
            setPaused(true);
        });
        audio.addPlayListener(() => {
            setPaused(false);
        });

        return (() => {
            audio.removePauseListener(() => {
                setPaused(true);
            })
            audio.removePlayListener(() => {
                setPaused(false);
            });
        })
    }, []);

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
                await player.nextSong();
            }}
        >
            <SkipNextRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 30 }} />
        </div>
    )
}

function LoopButton() {
    return (
        <div className={styles.loopButton}>
            <LoopRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 16 }} />
            {/* <ReplayRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 16 }} /> */}
        </div>
    )
}

function RandomButton() {
    return (
        <div className={styles.randomButton}>
            <ShuffleRoundedIcon htmlColor="#b3b3b3" style={{ fontSize: 16 }} />
        </div>
    )
}