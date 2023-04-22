import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {

}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
    console.log("[login] ");

    return new Promise<void>((resolve, reject) => {
        axios.get("").then(res => {
            
        });
    });
}