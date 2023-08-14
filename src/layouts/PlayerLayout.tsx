import { PlayerProvider } from "@/components/player/Player";
import { Aside } from "./Aside";
import { Header } from "./Header";
import styles from "./PlayerLayout.module.css";
import { AudioProvider, Children } from "@/components/player/AudioContext";
import { UserProvider } from "@/components/login/UserContext";

export function PlayerLayout({ children }: Children) {
    return (
        <div className={styles.main}>
            <AudioProvider>
                <PlayerProvider>
                    <UserProvider>
                        <Aside />
                        <Header />
                        <main className={styles.content}>
                            {children}
                        </main>
                    </UserProvider>
                </PlayerProvider>
            </AudioProvider>
        </div >
    );
}