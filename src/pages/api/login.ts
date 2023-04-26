import instance, { Base } from "../../util/axios";
import { NextApiRequest, NextApiResponse } from "next";

const axios = instance(Base.EX);

type Data = {

}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[login]");

    return new Promise<void>(async (resolve, reject) => {
        try {
            const key = await generateQRKey();
            const code = await generateQRCode(key);
            const status = await checkQRCodeStatus(key);
            response.status(200).json({
                code: code.qrimg,
                key: key
            });
            // setInterval(() => {
            //     const status = checkQRCodeStatus(key);
            //     switch (Number(status)) {
            //         case 801:

            //         case 803:

            //     }
            // });

            resolve();
        } catch (e) {
            console.error(e);
            reject();
        }
    });
}

const generateQRKey = async () => {
    const timestamp = Date.now();
    const key = await axios.get("/login/qr/key", {
        params: {
            timestamp
        }
    });
    return key.data.unikey;
}

const generateQRCode = async (key: string) => {
    const timestamp = Date.now();
    const code = await axios.get("/login/qr/create", {
        params: {
            key,
            qrimg: true,
            timestamp
        }
    });
    return code.data;
}

const checkQRCodeStatus = async (key: string) => {
    const timestamp = Date.now();
    const status = await axios.get("/login/qr/check", {
        params: {
            key,
            timestamp
        }
    });
    return status;
}