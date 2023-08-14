import instance, { Base } from "../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Song } from "./song";
import { Profile } from "@/pages/api/user";
import { Album } from "./album";
import { Artist } from "./artist";

export class Playlist {
    ID?: string;//
    name?: string;//
    coverImgUrl?: string;//
    tracks?: Song[];//
    creator?: Profile;//
    createTime?: number;//
    description?: string;//

    // 手动构造歌单
    constructor(
        ID?: string,
        name?: string,
        coverImgUrl?: string,
        tracks?: Song[],
        creator?: Profile,
        createTime?: number,
        description?: string
    ) {
        this.ID = ID;
        this.name = name;
        this.tracks = tracks;
        this.coverImgUrl = coverImgUrl;
        this.creator = creator;
        this.createTime = createTime;
        this.description = description;
    }

    // 根据歌单ID构造歌单（除了歌曲url）
    static async fetchInfoAsync(ID: string) {
        const axios = instance(Base.IN);
        return new Promise<Playlist>(async (resolve, reject) => {
            try {
                const playlist: {
                    id?: string,//
                    name?: string,// 
                    coverImgUrl?: string,//
                    creator?: Profile,//
                    createTime?: number,//
                    description?: string,//
                    tracks?: {//
                        id?: string,//
                        name?: string,//
                        artists?: {//
                            id: string,//
                            name: string//
                        }[],
                        coverUrl: string,//
                        duration: string,//
                        album: {
                            id: string,//
                            name: string,//
                            coverUrl: string,//
                        }
                    }[]
                } = await axios.get("/api/playlist", {
                    params: {
                        id: ID
                    }
                });

                // 把 tracks 包装成 Song 对象数组（没有歌曲url）
                const tracks = playlist.tracks?.map(track => {
                    return new Song(
                        track.id!,
                        {
                            name: track.name!,
                            artists: track.artists?.map(artist => {
                                return new Artist(artist.id, artist.name);
                            }),
                            coverUrl: track.coverUrl!,
                            album: new Album(track.album.id, track.album.name, track.album.coverUrl),
                            duration: track.duration,
                        }
                    );
                });

                resolve(new Playlist(
                    playlist.id,//
                    playlist.name,//
                    playlist.coverImgUrl,//
                    tracks,//
                    playlist.creator,//
                    playlist.createTime,//
                    playlist.description//
                ));
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    };

    async fetchAllTracksUrl() {
        if (this.tracks !== undefined) {
            this.tracks.forEach(song => {
                song.fetchUrl();
            });
        }
    }
}


// id/name/tracks (except song url)
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[playlist handler] ID: " + request.query.id);

    const axios = instance(Base.EX);
    return new Promise<void>(async (resolve, reject) => {
        try {

            let playlist: {
                id?: string,//
                name?: string,//
                coverImgUrl?: string,//
                description?: string,//
                trackCount?: string,
                playCount?: string,
                creator?: Profile,//
                createTime?: number,//

                tracks?: {//
                    id?: string,//
                    name?: string,//
                    artists?: {//
                        id: string,//
                        name: string//
                    }[],
                    coverUrl: string,//
                    duration: string,//
                    album: {
                        id: string,//
                        name: string,//
                        coverUrl: string,//
                    }
                }[],
            } = {};


            const playlistDetail: {
                playlist: {
                    id: string,
                    name: string,
                    coverImgUrl: string,
                    description: string,
                    trackCount: string,
                    playCount: string,
                    creator: Profile,
                    createTime: number
                }
            } = await axios.get("/playlist/detail", {
                params: {
                    id: request.query.id
                }
            });
            playlist.id = playlistDetail.playlist.id;
            playlist.name = playlistDetail.playlist.name;
            playlist.coverImgUrl = playlistDetail.playlist.coverImgUrl;
            playlist.creator = playlistDetail.playlist.creator;
            playlist.description = playlistDetail.playlist.description;
            playlist.createTime = playlistDetail.playlist.createTime;

            // console.log("playlist detail", playlistDetail);


            const allSongInfo: {
                songs: {
                    id: string,//
                    name: string,//
                    ar: {
                        id: string,//
                        name: string,//
                    }[],
                    al: {
                        id: string,//
                        name: string,//
                        picUrl: string,//
                    },
                    dt: string//
                }[]
            } = await axios.get("/playlist/track/all", {
                params: {
                    id: request.query.id,
                    limit: 100,
                    offset: 0
                }
            });
            playlist.tracks = allSongInfo.songs.map(song => {
                return {
                    id: song.id,
                    name: song.name,
                    artists: song.ar.map(artist => {
                        return {
                            id: artist.id,
                            name: artist.name
                        }
                    }),
                    coverUrl: song.al.picUrl,
                    duration: song.dt,
                    album: {
                        id: song.al.id,
                        name: song.al.name,
                        coverUrl: song.al.picUrl,
                    }
                };
            });

            response.status(200).json(playlist);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}