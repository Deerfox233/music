import instance, { Base } from "../../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

// 获取用户歌单
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const rawPlaylists: {
                playlist: {
                    id: string,
                    name: string,
                    coverImgUrl: string,
                }[]
            } = await axios.get("/user/playlist", {
                params: {
                    uid: request.query.uid
                }
            });

            // console.log(rawPlaylists);

            response.status(200).json(rawPlaylists.playlist);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}