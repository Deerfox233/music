import { NextApiRequest, NextApiResponse } from "next";
import instance, { Base } from "@/util/axios";
import { Album } from "./album";
import { Artist } from "./artist";

export class Song {
    ID: string;//
    name?: string;//
    artists?: Artist[];//
    coverUrl?: string;//
    url?: string;//
    album?: Album;
    duration?: string;

    // 手动构造歌曲
    constructor(ID: string, config: { name?: string, artists?: Artist[], coverUrl?: string, url?: string, album?: Album, duration?: string }) {
        this.ID = ID;
        this.name = config.name;
        this.artists = config.artists;
        this.coverUrl = config.coverUrl;
        this.url = config.url;
        this.album = config.album;
        this.duration = config.duration;
    }

    // 通过ID直接获取歌曲
    static async fetchInfoAsync(ID: string) {
        console.log("song fetch info async");
        const axios = instance(Base.IN);
        return new Promise<Song>(async (resolve, reject) => {
            try {
                const song: {
                    id?: string,
                    name?: string,
                    artists?: Artist[],
                    coverUrl?: string,
                    url?: string,
                } = await axios.get("/api/song", {
                    params: {
                        id: ID
                    }
                });

                resolve(new Song(song.id!, {
                    name: song.name,
                    artists: song.artists,
                    coverUrl: song.coverUrl,
                    url: song.url
                }));
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    }

    // 根据ID补充url
    async fetchUrl() {
        if (this.url !== undefined) {
            console.log("already got song url ", this.ID);
            return this;
        }
        const axios = instance(Base.IN);
        return new Promise<Song>(async (resolve, reject) => {
            try {
                const song: {
                    // id?: string,
                    // name?: string,
                    // artists?: Artist[],
                    // coverUrl?: string,
                    url?: string,
                } = await axios.get("/api/song", {
                    params: {
                        id: this.ID
                    }
                });

                // this.name = song.name;
                // this.artists = song.artists;
                // this.coverUrl = song.coverUrl;
                this.url = song.url;

                resolve(this);
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    }
}

// 返回歌曲url
export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[song handler] ID: " + request.query.id);

    const axios = instance(Base.EX);
    return new Promise<void>(async (resolve, reject) => {
        try {
            const song: {
                // id?: string,
                // name?: string,
                // artists?: Artist[],
                // coverUrl?: string,
                url?: string,//
            } = {};

            const songUrl = await axios.get("/song/url?id=" + request.query.id);
            song.url = songUrl.data[0].url;

            // const songDetail: {
            //     songs: {
            //         id: string,
            //         name: string,
            //         al: { picUrl: string },
            //         ar: { id: string, name: string }[]
            //     }[]
            // } = await axios.get("/song/detail?ids=" + request.query.id);
            // song.id = songDetail.songs[0].id;
            // song.name = songDetail.songs[0].name;
            // song.coverUrl = songDetail.songs[0].al.picUrl;
            // song.artists = songDetail.songs[0].ar.map(artist => {
            //     return new Artist(artist.id, artist.name);
            // });

            response.status(200).json(song);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}