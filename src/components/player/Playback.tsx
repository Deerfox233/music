import styles from "./Playback.module.css"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';

export function Playback() {
    return (
        <div className={styles.main}>
            <div className={styles.playback}>
                <PreviousButton />
                <PlayButton />
                <NextButton />
            </div>
        </div>
    );
}

function PlayButton() {
    

    return (
        <div className={styles.playButton}>
            {/* <PlayArrowRoundedIcon style={{ fontSize: 35 }} /> */}
            <PauseRoundedIcon style={{ fontSize: 35 }} />
        </div>
    );
}

function PreviousButton() {
    return (
        <div className={styles.previousButton}>
            <SkipPreviousRoundedIcon style={{ fontSize: 30 }} />
        </div>
    )
}

function NextButton() {
    return (
        <div className={styles.nextButton}>
            <SkipNextRoundedIcon style={{ fontSize: 30 }} />
        </div>
    )
}