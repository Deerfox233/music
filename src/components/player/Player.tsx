import { Playback } from "./Playback";
import { ProgressBar } from "./ProgressBar";
import { Utilities } from "./Utilities";
import styles from "./Player.module.css"

export function Player() {
    let isPlaying: boolean;

    return (
        <>
            <div className={styles.player}>
                <Playback />
                <ProgressBar />
                <Utilities />
            </div>
        </>
    );
}