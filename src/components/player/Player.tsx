import { Playback } from "@/components/player/Playback";
import { SongInfo } from "@/components/player/SongInfo";
import { Utilities } from "@/components/player/Utilities";
import styles from "@/components/player/Player.module.css"
import { AudioContext, AudioProvider, Children } from "@/components/player/AudioContext";
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

    initPlaylist: (playlist: Playlist, index: number) => void,
    initPlaylistByID: (playlistID: string, index: number) => void,
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

    //根据ID初始化歌单
    const initPlaylistByID = async (playlistID: string, index: number) => {
        audio.pause();

        // 创建一个没有歌曲url的对应ID歌单（含有Song原型）
        const playlist = await Playlist.fetchInfoAsync(playlistID);

        setPlaylist(playlist);
        console.log(playlist);

        setIndex(index);

        // 至少让第index首歌曲的url可用，便于播放器启动
        playlist.tracks![index].fetchUrl().then(song => {
            audio.setAudioSrc(song?.url!);
            audio.setCurrentTime(0);

            setTimeout(() => {
                audio.play();
            }, 500);
        });
    }

    // 直接初始化歌单（在其他地方创建好的歌单直接拿来给播放器进行播放，可以不含有歌曲url）
    // 传入的 playlist 如果没有 Song 的原型，无法调用 fetchUrl() 方法
    const initPlaylist = async (playlist: Playlist, index: number) => {
        audio.pause();

        setPlaylist(playlist);
        console.log(playlist);

        setIndex(index);

        // 至少让第index首歌曲的url可用，便于播放器启动
        playlist.tracks![index].fetchUrl().then(song => {
            audio.setAudioSrc(song?.url!);
            audio.setCurrentTime(0);

            setTimeout(() => {
                audio.play();
            }, 500);
        });
    }

    //获取当前播放曲目
    const currentTrack = () => {
        if (playlist === null || playlist.tracks === undefined) {
            console.log("no current track yet");
            return;
        }
        return playlist.tracks[index];
    }

    //切换为下一首
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

    //切换为上一首
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