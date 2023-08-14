import { RawRecommend } from "@/types/recommend/recommend";
import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[recommend]");

    return new Promise<void>(async (resolve, reject) => {
        try {
            const info: {
                recommend: RawRecommend[]
            } = await axios.get("recommend/resource", {
                params: {
                    cookie: request.query.cookie,
                }
            });

            response.status(200).json(info.recommend);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    });
}