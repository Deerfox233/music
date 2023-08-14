import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Children } from "../player/AudioContext";
import { Profile } from "@/pages/api/user";

export type UserContextProps = {
    profile: null | Profile
    setProfile: Dispatch<SetStateAction<Profile | null>>
}

export const UserContext = createContext({} as UserContextProps);

// 实际上是提供用户登录信息的Provider
export function UserProvider({ children }: Children) {
    const [profile, setProfile] = useState({} as null | Profile);

    return (
        <UserContext.Provider value={{
            profile,
            setProfile
        }}>
            {children}
        </UserContext.Provider>
    )
}