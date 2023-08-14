import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

export type Profile = {
    userId: string,
    nickname: string,
    avatarUrl: string,
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[user]");

    return new Promise<void>(async (resolve, reject) => {
        try {
            const info: {
                profile: Profile
            } = await axios.get("/user/account", {
                params: {
                    cookie: request.query.cookie,
                }
            });

            response.status(200).json(info.profile);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    });
}