import { UserContext } from "@/components/login/UserContext";
import { GetServerSideProps } from "next";
import { useContext } from "react";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {


    return {
        props: {

        }
    };
}

type UserPageProps = {

}

// 用户页面
export default function UserPage() {
    const user = useContext(UserContext);

    console.log(user);

    return (
        <div>
            user home
        </div>
    )
}