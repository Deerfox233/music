import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";



export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[banner]");

    const axios = instance(Base.EX);
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