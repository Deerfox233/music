import { NextApiRequest, NextApiResponse } from "next";
import artist, { Artist } from "../artist";
import { Song } from "../song";
import instance, { Base } from "@/util/axios";
import { Album } from "../album";

const axios = instance(Base.EX);

// 获取歌手热门歌曲
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    return new Promise<void>(async (resolve, reject) => {
        try {
            let hotSongs: Song[];

            const hotSongsDetail: {
                hotSongs: {
                    id: string,
                    name: string,
                    ar: {
                        id: string,
                        name: string
                    }[],
                    dt: string,
                    al: {
                        id: string,
                        name: string,
                        picUrl: string,
                    }
                }[],
            } = await axios.get("/artists", {
                params: {
                    id: request.query.id
                }
            });

            hotSongs = hotSongsDetail.hotSongs.map(hotSong => {
                return new Song(
                    hotSong.id,
                    {
                        name: hotSong.name,
                        artists: hotSong.ar.map(artist => {
                            return new Artist(artist.id, artist.name);
                        }),
                        coverUrl: hotSong.al.picUrl,
                        duration: hotSong.dt,
                        album: new Album(hotSong.al.id, hotSong.al.name, hotSong.al.picUrl)
                    }
                );
            })

            response.status(200).json(hotSongs);
            resolve();
        } catch (e) {
            console.log(e);
            reject();
        }
    })
}