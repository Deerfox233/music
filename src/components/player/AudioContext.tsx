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
    setCurrentTime: (time: number) => void,
    isPaused: () => boolean,
    addPauseListener: (listener: () => void) => void,
    removePauseListener: (listener: () => void) => void,
    addPlayListener: (listener: () => void) => void,
    removePlayListener: (listener: () => void) => void,
    addTimeUpdateListener: (listener: () => void) => void,
    removeTimeUpdateListener: (listener: () => void) => void
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

    const setCurrentTime = (time: number) => {
        audioRef.current.currentTime = time;
    }

    const isPaused = () => {
        return audioRef.current.paused;
    }

    const addPauseListener = (listener: () => void) => {
        audioRef.current.addEventListener("pause", listener);

    }

    const removePauseListener = (listener: () => void) => {
        audioRef.current.removeEventListener("pause", listener);
    }

    const addPlayListener = (listener: () => void) => {
        audioRef.current.addEventListener("play", listener);
    }

    const removePlayListener = (listener: () => void) => {
        audioRef.current.removeEventListener("play", listener);
    }

    const addTimeUpdateListener = (listener: () => void) => {
        audioRef.current!.addEventListener("timeupdate", listener);
    }

    const removeTimeUpdateListener = (listener: () => void) => {
        audioRef.current!.removeEventListener("timeupdate", listener);
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
            setCurrentTime,
            isPaused,
            addPauseListener,
            removePauseListener,
            addPlayListener,
            removePlayListener,
            addTimeUpdateListener,
            removeTimeUpdateListener
        }}>
            {children}
            <audio ref={audioRef} src={audioSrc} />
        </AudioContext.Provider>
    )
}