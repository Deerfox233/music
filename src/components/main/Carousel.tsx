import { useContext, useEffect, useState } from "react"
import styles from "./Carousel.module.css"
import Image from "next/image"
import instance, { Base } from "@/util/axios";
import { PlayerContext } from "../player/Player";
import { Playlist } from "@/pages/api/playlist";
import { Song } from "@/pages/api/song";

export function Carousel() {
    const [banners, setBanners] = useState([] as ({
        imageUrl: string
        title: string
        targetID: string
    }[]));
    const axios = instance(Base.IN);

    const fetchBanners = async () => {
        let bannerList = await axios.get("/api/banner") as [];
        return bannerList.map((banner: {
            imageUrl: string,
            typeTitle: string,
            targetId: string
        }) => {
            return {
                imageUrl: banner.imageUrl,
                title: banner.typeTitle,
                targetID: banner.targetId
            }
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            const bannerList: {
                imageUrl: string
                title: string
                targetID: string
            }[] = await fetchBanners();
            setBanners(bannerList);
        }
        fetchData();
    }, []);

    return (
        <div className={styles.carousel}>
            {banners.map(banner => {
                return (
                    <span key={banner.imageUrl}>
                        <Banner
                            imageUrl={banner.imageUrl}
                            title={banner.title}
                            targetID={banner.targetID}
                        />
                    </span>
                )
            })}
        </div>
    )
}

type BannerProps = {
    imageUrl: string,
    title: string,
    targetID: string
}

export function Banner(props: BannerProps) {
    const player = useContext(PlayerContext);

    return (
        <div
            className={styles.banner}
            onClick={async () => {
                const tempPlaylist = new Playlist();
                const tempSong = new Song(props.targetID);

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