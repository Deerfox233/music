import instance, { Base } from "@/util/axios";
import { NextApiRequest, NextApiResponse } from "next";
import { Album } from "../album";
import { Artist } from "../artist";

const axios = instance(Base.EX);

// 获取歌手热门专辑
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            // let albums: Album[];

            const albumsDetail: {
                hotAlbums: {
                    id: string,
                    name: string,
                    picUrl: string,
                    artists: {
                        id: string,
                        name: string
                    }[],
                    description: string,
                    publishTime: string,
                }[]
            } = await axios.get("/artist/album", {
                params: {
                    id: request.query.id
                }
            });

            const fetchAlbums = async () => {
                let albums: Promise<Album>[] = albumsDetail.hotAlbums.map(async hotAlbum => {
                    const axios = instance(Base.IN);
                    const album: Album = await axios.get("/api/album", {
                        params: {
                            id: hotAlbum.id,
                        },
                    });
                    return album;
                });

                await Promise.all(albums).then(albums => {
                    console.log(albums);
                    response.status(200).json(albums);
                    resolve();
                });
            }

            await fetchAlbums();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}