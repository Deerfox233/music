import { Player } from "@/components/player/Player";
import styles from "./Header.module.css"

export function Header() {
    return (
        <div className={styles.header}>
            <Player />
        </div>
    );
}