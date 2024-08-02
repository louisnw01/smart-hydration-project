import { emailIsVerifiedAtom } from "@/atom/user";
import { getItemAsync } from "expo-secure-store";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { request } from "./fetch";

export default function useSession() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const setEmailVerifiedAtom = useSetAtom(emailIsVerifiedAtom);

    const getTokenFromStorage = async () => {
        const rawToken = await getItemAsync("auth-token");
        const authToken = rawToken ? JSON.parse(rawToken) : null;
        if (!authToken) {
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }
        const result = await request("/user/check-token", {
            method: "post",
            auth: authToken,
        });
        setIsSuccess(result.ok);
        setIsEmailVerified(result.status != 403);
        setEmailVerifiedAtom(result.status != 403);
        setIsLoading(false);
    };

    useEffect(() => {
        getTokenFromStorage();
    }, []);
    return { isLoading, isSuccess, isEmailVerified };
}
