import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export class Artist {
    ID: string;
    name?: string;
    avatarUrl?: string;
    description?: string;
    albumSize?: string;
    musicSize?: string;
    mvSize?: string;

    constructor(ID: string, name?: string, avatarUrl?: string, description?: string, albumSize?: string, musicSize?: string, mvSize?: string) {
        this.ID = ID;
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.description = description;
        this.albumSize = albumSize;
        this.musicSize = musicSize;
        this.mvSize = mvSize;
    }

    static async fetchInfoAsync(ID: string) {
        const axios = instance(Base.IN);
        return new Promise<Artist>(async (resolve, reject) => {
            try {
                const artist = await axios.get<any, Artist>("/api/artist", {
                    params: {
                        id: ID,
                    }
                });

                resolve(artist);
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let artist: Artist;

            const artistDetail: {
                data: {
                    artist: {
                        id: string,
                        avatar: string,
                        name: string,
                        briefDesc: string,
                        albumSize: string,
                        musicSize: string,
                        mvSize: string
                    }
                }
            } = await axios.get("/artist/detail", {
                params: {
                    id: request.query.id
                }
            });

            artist = new Artist(
                artistDetail.data.artist.id,
                artistDetail.data.artist.name,
                artistDetail.data.artist.avatar,
                artistDetail.data.artist.briefDesc,
                artistDetail.data.artist.albumSize,
                artistDetail.data.artist.musicSize,
                artistDetail.data.artist.mvSize
            );

            response.status(200).json(artist);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}