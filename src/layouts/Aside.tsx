import styles from "./Aside.module.css"
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import PianoRoundedIcon from '@mui/icons-material/PianoRounded';
import EqualizerRoundedIcon from '@mui/icons-material/EqualizerRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import NightlifeRoundedIcon from '@mui/icons-material/NightlifeRounded';
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded';

export function Aside() {
    return (
        <div className={styles.aside}>
            <Logo />
            <SearchBar />
        </div>
    );
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
    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                className={styles.input}
            />
        </div>
    );
}

