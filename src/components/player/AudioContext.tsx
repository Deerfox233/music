import { Dispatch, RefObject, createContext, useEffect, useRef, useState } from "react"

export type AudioContextProps = {
    audioRef: RefObject<HTMLAudioElement>,
    audioSrc: string,
    setAudioSrc: Dispatch<string>,
    setVolume: (volume: number) => void,
    pause: () => void,
    play: () => void,
    getDuration: () => number,
    getCurrentTime: () => number,
    isPaused: () => boolean,
    addPauseListener: (listener: () => void) => void,
    addPlayListener: (listener: () => void) => void,
}

export const AudioContext = createContext({} as AudioContextProps);

export type Children = {
    children: React.ReactNode
}

export function AudioProvider({ children }: Children) {
    const audioRef = useRef({} as HTMLAudioElement);
    const [audioSrc, setAudioSrc] = useState("/test.mp3");

    const setVolume = (volume: number) => {
        audioRef.current!.volume = Number((volume / 100).toFixed(1));
    }

    const pause = () => {
        audioRef.current!.pause();
    }

    const play = () => {
        audioRef.current!.play();
    }

    const getDuration = () => {
        return audioRef.current!.duration;
    }

    const getCurrentTime = () => {
        return audioRef.current!.currentTime;
    }

    const isPaused = () => {
        return audioRef.current.paused;
    }

    const addPauseListener = (listener: () => void) => {
        useEffect(() => {
            audioRef.current.addEventListener("pause", listener);
            return () => {
                audioRef.current.removeEventListener("pause", listener);
            }
        }, []);
    }

    const addPlayListener = (listener: () => void) => {
        useEffect(() => {
            audioRef.current.addEventListener("play", listener);
            return () => {
                audioRef.current.removeEventListener("play", listener);
            }
        }, []);
    }

    return (
        <AudioContext.Provider value={{
            audioRef,
            audioSrc,
            setAudioSrc,
            setVolume,
            pause,
            play,
            getDuration,
            getCurrentTime,
            isPaused,
            addPauseListener,
            addPlayListener,
        }}>
            {children}
            <audio ref={audioRef} src={audioSrc} />
        </AudioContext.Provider>
    )
}