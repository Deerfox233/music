import instance, { Base } from "../../util/axios";
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
        const axios = instance(Base.IN);
        return new Promise<Playlist>(async (resolve, reject) => {
            try {
                const playlistData: { name: string, tracks: [] } = await axios.get("/api/playlist", {
                    params: {
                        id: ID
                    }
                });
                const name = playlistData.name;
                const tracks = (playlistData.tracks as []).map((track: {
                    id: string,
                    name: string,
                    ar: [],
                    al: { picUrl: string }
                }) => {
                    const artists: Artist[] = track.ar.map((artist: {
                        id: string,
                        name: string
                    }) => {
                        return new Artist(artist.id, artist.name);
                    })
                    return new Song(track.id, track.name, artists, track.al.picUrl);
                });
                resolve(new Playlist(ID, name, tracks));
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

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[playlist handler] ID: " + request.query.id);

    const axios = instance(Base.EX);
    return new Promise<void>(async (resolve, reject) => {
        try {
            const detail: { playlist: { tracks: [] } }
                = await axios.get("/playlist/detail", {
                    params: {
                        id: request.query.id
                    }
                });
            const playlistData = detail.playlist;

            const allTracks: { songs: [] }
                = await axios.get("/playlist/track/all", {
                    params: {
                        id: request.query.id,
                        limit: 100,
                        offset: 0
                    }
                });
            playlistData.tracks = allTracks.songs;

            response.status(200).json(playlistData);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}