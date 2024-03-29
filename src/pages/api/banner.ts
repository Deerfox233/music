import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export type Banner = {
    imageUrl: string,
    typeTitle: string,
    targetId: string
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[banner]");

    return new Promise<void>(async (resolve, reject) => {
        try {
            const banners: { banners: [] } = await axios.get("/banner");
            response.status(200).json(banners.banners);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    });
}