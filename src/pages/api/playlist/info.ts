import { RawPlaylist } from "@/types/playlist/playlist";
import instance, { Base } from "../../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {

            let info: {
                playlist: RawPlaylist
            } = await axios.get("/playlist/detail", {
                params: {
                    id: request.query.id
                }
            });

            response.status(200).json(info.playlist);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}