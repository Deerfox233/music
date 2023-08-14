import { RawSongInfo } from "@/types/playlist/playlist";
import instance, { Base } from "../../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {

            const info: {
                songs: RawSongInfo[]
            } = await axios.get("/playlist/track/all", {
                params: {
                    id: request.query.id,
                    limit: 100,
                    offset: 0
                }
            });
            // playlist.tracks = allSongInfo.songs.map(song => {
            //     return {
            //         id: song.id,
            //         name: song.name,
            //         artists: song.ar.map(artist => {
            //             return {
            //                 id: artist.id,
            //                 name: artist.name
            //             }
            //         }),
            //         coverUrl: song.al.picUrl
            //     };
            // });

            response.status(200).json(info.songs);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}