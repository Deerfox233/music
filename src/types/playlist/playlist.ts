export type RawPlaylist = {
    id: string;
    name: string;
    coverImgUrl: string;
    description: string;
    trackCount: string;
    playCount: string;
};

export type RawSongInfo = {
    id: string;
    name: string;
    ar: {
        id: string;
        name: string;
    }[];
    al: {
        picUrl: string;
    };
};