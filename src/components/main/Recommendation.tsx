import { RecommendPlaylist } from "@/types/recommend/recommend";
import styles from "./Recommendation.module.css"
import Image from "next/image";
import instance, { Base } from "@/util/axios";
import { RawPlaylist } from "@/types/playlist/playlist";
import Link from "next/link";
import { url } from "inspector";

const axios = instance(Base.IN);

// 歌单推荐
export function Recommendation(props: {
    data: RawPlaylist[]
}) {
    const rawPlaylists = props.data;

    return (
        <div className={styles.recommendation}>
            {
                rawPlaylists.map(rawPlaylist => {
                    return (
                        <span key={rawPlaylist.id}>
                            <Cover
                                ID={rawPlaylist.id}
                                name={rawPlaylist.name}
                                coverUrl={rawPlaylist.coverImgUrl}
                                size={244}
                                radius={10}
                                type="playlist"
                            />
                        </span>
                    );
                })
            }
        </div>
    );
}

type CoverProps = RecommendPlaylist & {
    size: number,
    radius: number,
    type: string,
    glow?: boolean,
    offset?: number,
    intensity?: number
};

export function Cover(props: CoverProps) {
    const ID = props.ID;

    return (
        <Link href={"/" + props.type + "/" + ID}
            style={{
                position: "relative"
            }}
        >
            <div className={styles.playlistCover} style={{ width: props.size, height: props.size, borderRadius: props.radius }}>
                <Image
                    src={props.coverUrl ? props.coverUrl : "https://via.placeholder.com/" + props.size + props.size}
                    alt="Playlist Cover"
                    width={props.size}
                    height={props.size}
                    style={{
                        zIndex: 1,
                    }}
                />

            </div>
            {
                props.glow ?
                    <div className={styles.shadow}
                        style={{
                            width: props.size,
                            height: props.size,
                            borderRadius: props.radius,
                            marginTop: -props.size + props.offset,
                            filter: "blur(16px) opacity(" + props.intensity + ")",
                            backgroundImage: `url(${props.coverUrl ? props.coverUrl : "https://via.placeholder.com/" + props.size + props.size})`
                        }}
                    ></div> :
                    <></>
            }
        </Link>
    )
}