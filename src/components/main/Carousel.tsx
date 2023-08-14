import { useContext, useEffect, useState } from "react"
import styles from "./Carousel.module.css"
import Image from "next/image"
import { PlayerContext } from "../player/Player";
import { Playlist } from "@/pages/api/playlist";
import { Song } from "@/pages/api/song";
import { Banner } from "@/pages/api/banner";

export function Carousel(props: {
    data: {
        bannerList: Banner[]
    }
}) {

    const [banners, setBanners] = useState([] as Banner[]);


    useEffect(() => {
        setBanners(props.data.bannerList);
    }, [banners, setBanners]);


    return (
        <div className={styles.carousel}>
            {
                banners.map(banner => {
                    return (
                        <span key={banner.imageUrl}>
                            <Banner
                                imageUrl={banner.imageUrl}
                                typeTitle={banner.typeTitle}
                                targetId={banner.targetId}
                            />
                        </span>
                    )
                })
            }
        </div>
    )
}

// type BannerProps = {
//     imageUrl: string,
//     title: string,
//     targetID: string
// }
type BannerProps = Banner;

export function Banner(props: BannerProps) {
    const player = useContext(PlayerContext);

    return (
        <div
            className={styles.banner}
            onClick={async () => {
                const tempPlaylist = new Playlist();
                const tempSong = new Song(props.targetId);

                await tempSong.fetchUrl();
                tempPlaylist.tracks = [tempSong];

                await player.initPlaylist(tempPlaylist);
            }}
        >
            <Image
                src={props.imageUrl}
                alt="Banner"
                width={783}
                height={290}
            />
        </div>
    )
}