import { PlayerProvider } from "@/components/player/Player";
import { Aside } from "./Aside";
import { Header } from "./Header";
import styles from "./PlayerLayout.module.css";
import { AudioProvider, Children } from "@/components/player/AudioContext";

export function PlayerLayout({ children }: Children) {
    return (
        <div className={styles.main}>
            <AudioProvider>
                <PlayerProvider>
                    <Aside />
                    <Header />
                    <main className={styles.content}>
                        {children}
                    </main>
                </PlayerProvider>
            </AudioProvider>
        </div >
    );
}