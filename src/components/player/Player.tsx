import { Playback } from "./Playback";
import { SongInfo } from "./SongInfo";
import { Utilities } from "./Utilities";
import styles from "./Player.module.css"
import { AudioContext, AudioProvider, Children } from "./AudioContext";
import { Playlist } from "@/pages/api/playlist";
import React, { Dispatch, createContext, useContext, useEffect, useState } from "react";
import { Song } from "@/pages/api/song";

export function Player() {
    return (
        <div className={styles.player}>
            <Playback />
            <SongInfo />
            <Utilities />
        </div>
    );
}

export enum Mode {
    // 顺序播放
    SEQUENTIAL,
    // 列表循环
    LOOP,
    // 单曲循环
    SINGLE,
    // 随机播放
    RANDOM
}

export type PlayerContextProps = {
    // 播放列表
    playlist: Playlist,
    setPlaylist: Dispatch<Playlist>,
    // 当前曲目索引
    index: number,
    setIndex: Dispatch<number>,
    // 播放模式
    mode: Mode,
    setMode: Dispatch<Mode>,

    initPlaylist: (playlist: Playlist) => void,
    initPlaylistByID: (playlistID: string) => void,
    currentTrack: () => Song | undefined,
    nextSong: () => void,
    previousSong: () => void,

    addEndedListener: (listener: () => void) => void,
    removeEndedListener: (listener: () => void) => void,
}

export const PlayerContext = createContext({} as PlayerContextProps);

export function PlayerProvider({ children }: Children) {
    const audio = useContext(AudioContext);

    const [playlist, setPlaylist] = useState<Playlist>(null!);
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState(Mode.SEQUENTIAL);

    const initPlaylistByID = async (playlistID: string) => {
        audio.pause();
        const playlist = await Playlist.fetchInfoAsync(playlistID);

        setPlaylist(playlist);
        console.log(playlist);

        setIndex(0);

        playlist.tracks![0].fetchUrl().then(song => {
            audio.setAudioSrc(song?.url!);
            audio.setCurrentTime(0);
        });
    }

    const initPlaylist = async (playlist: Playlist) => {
        audio.pause();
        setPlaylist(playlist);
        console.log(playlist);

        setIndex(0);

        playlist.tracks![0].fetchUrl().then(song => {
            audio.setAudioSrc(song?.url!);
            audio.setCurrentTime(0);
        });
    }

    const currentTrack = () => {
        if (playlist === null || playlist.tracks === undefined) {
            console.log("no current track yet");
            return;
        }
        return playlist.tracks[index];
    }

    const nextSong = async () => {
        if (playlist === null || playlist.tracks === undefined) {
            console.error("something wrong at nextSong()");
            return;
        }

        //sequential test
        if (playlist.tracks[index + 1] !== undefined) {
            setIndex((index + 1));

            console.log("fetch next song");
            playlist.tracks[index + 1].fetchUrl().then(song => {
                audio.setAudioSrc(song?.url!);
                setTimeout(() => {
                    audio.play();
                }, 500);
            });
        }
    }

    const previousSong = async () => {
        if (playlist === null || playlist.tracks === undefined) {
            console.error("something wrong at previousSong()");
            return;
        }

        //sequential test
        if (playlist.tracks[index - 1] !== undefined) {
            setIndex(index - 1);

            console.log("fetch previous song");
            playlist.tracks[index - 1].fetchUrl().then(song => {
                audio.setAudioSrc(song?.url!);
                setTimeout(() => {
                    audio.play();
                }, 500);
            });
        }
    }

    const addEndedListener = (listener: () => void) => {
        audio.audioRef.current!.addEventListener("ended", listener);
    }

    const removeEndedListener = (listener: () => void) => {
        audio.audioRef.current!.removeEventListener("ended", listener);
    }

    return (
        <PlayerContext.Provider value={{
            playlist,
            setPlaylist,
            index,
            setIndex,
            mode,
            setMode,
            initPlaylist,
            initPlaylistByID,
            currentTrack,
            nextSong,
            previousSong,
            addEndedListener,
            removeEndedListener
        }}>
            {children}
        </PlayerContext.Provider>
    );
}