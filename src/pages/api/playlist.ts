import instance, { Base } from "../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Artist, Song } from "./song";

export class Playlist {
    ID?: string;
    name?: string;
    tracks?: Song[];

    // 手动构造歌单
    constructor(ID?: string, name?: string, tracks?: Song[]) {
        this.ID = ID;
        this.name = name;
        this.tracks = tracks;
    }

    // 根据歌单ID构造歌单
    static async fetchInfoAsync(ID: string) {
        const axios = instance(Base.IN);
        return new Promise<Playlist>(async (resolve, reject) => {
            try {
                const playlist: {
                    id?: string,
                    name?: string,
                    tracks?: {
                        id?: string,
                        name?: string,
                        artists?: Artist[],
                        coverUrl: string
                    }[]
                } = await axios.get("/api/playlist", {
                    params: {
                        id: ID
                    }
                });

                const tracks = playlist.tracks?.map(track => {
                    return new Song(
                        track.id!,
                        track.name!,
                        track.artists?.map(artist => {
                            return new Artist(artist.ID, artist.name);
                        }),
                        track.coverUrl!
                    );
                });

                resolve(new Playlist(
                    playlist.id,
                    playlist.name,
                    tracks
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
                id?: string,
                name?: string,
                tracks?: {
                    id?: string,
                    name?: string,
                    artists?: {
                        id: string,
                        name: string
                    }[],
                    coverUrl: string
                }[]
            } = {};


            const playlistDetail: {
                playlist: {
                    id: string,
                    name: string,
                }
            } = await axios.get("/playlist/detail", {
                params: {
                    id: request.query.id
                }
            });
            playlist.id = playlistDetail.playlist.id;
            playlist.name = playlistDetail.playlist.name;


            const allSongInfo: {
                songs: {
                    id: string,
                    name: string,
                    ar: {
                        id: string,
                        name: string,
                    }[],
                    al: {
                        picUrl: string
                    }
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
                    coverUrl: song.al.picUrl
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