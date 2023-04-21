import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

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

        return new Promise<string | undefined>((resolve, reject) => {
            if (this.url === undefined) {
                axios.get("http://localhost:5000/api/song", {
                    params: {
                        id: this.ID,
                    }
                }).then(res => {
                    const songData = res.data;
                    this.url = songData.url;
                    resolve(this.url);
                });
            } else {
                resolve(this.url);
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

export default function handler(request: NextApiRequest, response: NextApiResponse<Song>) {
    console.log("[song handler] ID: " + request.query.id);

    return new Promise<void>((resolve, reject) => {
        axios.get("http://localhost:3000/song/url?id=" + request.query.id).then(res => {
            const songData = res.data.data[0];
            response.status(200).json(songData);
            resolve();
        });
    })
}