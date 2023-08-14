import instance, { Base } from "../../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

type Data = {

}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const status = await checkQRCodeStatus(request.query.key as string);

            if (status.cookie) {
                response.setHeader("Set-Cookie", status.cookie);
            }
            response.status(200).json(status);
            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}

const checkQRCodeStatus = async (key: string) => {
    const timestamp = Date.now();
    const status: {
        code: number,
        message: string,
        cookie: string
    } = await axios.get("/login/qr/check", {
        params: {
            key,
            timestamp
        }
    });
    return status;
}