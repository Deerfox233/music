import instance, { Base } from "../../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Profile } from "@/pages/api/user"

const axios = instance(Base.EX);

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {

            const timestamp = Date.now();
            const info: {
                data: {
                    profile: Profile
                }
            } = await axios.get("login/status", {
                params: {
                    cookie: request.query.cookie,
                    timestamp
                }
            });

            response.status(200).json(info.data.profile);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}
