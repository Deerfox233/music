import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Song } from "./song";
import { Artist } from "./artist";

const axios = instance(Base.EX);

export class Album {
    ID: string;
    name?: string;
    coverImgUrl?: string;
    artists?: Artist[];
    date?: string;
    description?: string;
    tracks?: Song[];

    constructor(ID: string, name?: string, coverImgUrl?: string, artists?: Artist[], date?: string, description?: string, tracks?: Song[]) {
        this.ID = ID;
        this.name = name;
        this.coverImgUrl = coverImgUrl;
        this.artists = artists;
        this.date = date;
        this.description = description;
        this.tracks = tracks;
    }

    static async fetchInfoAsync(ID: string) {
        const axios = instance(Base.IN);
        return new Promise<Album>(async (resolve, reject) => {
            try {
                const album = await axios.get<any, Album>("/api/album", {
                    params: {
                        id: ID,
                    }
                });

                resolve(album);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
}

//获取专辑信息
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let album: Album;

            const albumDetail: {
                album: {
                    id: string,
                    name: string,
                    picUrl: string,
                    artists: {
                        id: string,
                        name: string
                    }[],
                    description: string,
                    publishTime: string,
                }
                songs: {
                    id: string,
                    name: string,
                    ar: {
                        id: string,
                        name: string
                    }[],
                    dt: string,
                    al: {
                        id: string,
                        name: string,
                        picUrl: string,
                    }
                }[],
            } = await axios.get("/album", {
                params: {
                    id: request.query.id
                }
            });

            album = new Album(
                albumDetail.album.id,
                albumDetail.album.name,
                albumDetail.album.picUrl,
                albumDetail.album.artists.map(artist => {
                    return new Artist(artist.id, artist.name);
                }),
                albumDetail.album.publishTime,
                albumDetail.album.description,
                albumDetail.songs.map(song => {
                    return new Song(
                        song.id,
                        {
                            name: song.name,
                            artists: song.ar.map(artist => {
                                return new Artist(artist.id, artist.name);
                            }),
                            coverUrl: song.al.picUrl,
                            duration: song.dt,
                            album: new Album(song.al.id, song.al.name, song.al.picUrl)
                        }
                    );
                })
            );

            response.status(200).json(album);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}