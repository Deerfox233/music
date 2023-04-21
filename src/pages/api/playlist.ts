import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Artist, Song } from "./song";

export class Playlist {
    ID: string;
    name?: string;
    tracks?: Song[];

    constructor(ID: string, name?: string, tracks?: Song[]) {
        this.ID = ID;
        this.name = name;
        this.tracks = tracks;
    }

    static async fetchInfoAsync(ID: string) {
        return new Promise<Playlist>((resolve, reject) => {
            axios.get("http://localhost:5000/api/playlist", {
                params: {
                    id: ID
                }
            }).then(res => {
                const playlistData = res.data;
                const name = playlistData.name;
                const tracks = (playlistData.tracks as []).map((track: { id: string, name: string, ar: [], al: { picUrl: string } }) => {
                    const artists: Artist[] = track.ar.map((artist: { id: string, name: string }) => {
                        return new Artist(artist.id, artist.name);
                    })
                    return new Song(track.id, track.name, artists, track.al.picUrl);
                });
                resolve(new Playlist(ID, name, tracks));
            });
        })
    };

    async fetchAllTracksUrl() {
        if (this.tracks !== undefined) {
            this.tracks.forEach(song => {
                song.fetchUrl();
            });
        }
    }
}

export default function handler(request: NextApiRequest, response: NextApiResponse<Playlist>) {
    console.log("[playlist handler] ID: " + request.query.id);

    return new Promise<void>((resolve, reject) => {
        axios.get("http://localhost:3000/playlist/detail?id=" + request.query.id).then(res1 => {
            axios.get("http://localhost:3000/playlist/track/all?id=" + request.query.id + "&limit=100&offset=0").then(res2 => {
                const playlistData = res1.data.playlist;
                playlistData.tracks = res2.data.songs;
                response.status(200).json(playlistData);
                resolve();
            });
        });
    })
}