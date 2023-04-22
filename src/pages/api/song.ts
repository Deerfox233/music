import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import instance, { Base } from "@/util/axios";

export class Song {
    ID: string;
    name?: string;
    artist?: Artist[];
    url?: string;
    coverUrl?: string;

    constructor(ID: string, name?: string, artist?: Artist[], coverUrl?: string) {
        this.ID = ID;
        this.name = name;
        this.artist = artist;
        this.coverUrl = coverUrl;
    }

    async fetchUrl() {
        // console.log("fetch url");

        const axios = instance(Base.IN);
        return new Promise<string | undefined>(async (resolve, reject) => {
            try {
                if (this.url === undefined) {
                    const songData: { url: string } = await axios.get("/api/song", {
                        params: {
                            id: this.ID,
                        }
                    });
                    this.url = songData.url;
                    resolve(this.url);
                } else {
                    resolve(this.url);
                }
            } catch (e) {
                console.error(e);
                reject();
            }
        });
    }
}

export class Artist {
    ID: string;
    name?: string;

    constructor(ID: string, name?: string) {
        this.ID = ID;
        this.name = name;
    }
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[song handler] ID: " + request.query.id);

    const axios = instance(Base.EX);
    return new Promise<void>(async (resolve, reject) => {
        try {
            const songData = await axios.get("/song/url?id=" + request.query.id);
            response.status(200).json(songData.data[0]);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}