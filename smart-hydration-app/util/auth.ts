import { authTokenAtom, emailIsVerifiedAtom } from "@/atom/user";
import { useAtomValue, useSetAtom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { useEffect } from "react";
import { request } from "./fetch";

const checkTokenQAtom = atomWithQuery((get) => ({
    queryKey: ["check-token", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        console.log("checkTokenQueryFunctionRan!");
        const response = await request("/user/check-token", {
            auth: token as string,
            method: "post",
        });
        if (response.status != 403 && !response.ok) {
            throw new Error("Failed to check token");
        }
        console.log("got here, ", response.status);
        return response.status != 403;
    },
    enabled: !!get(authTokenAtom),
    placeholderData: undefined,
}));

export default function useSession() {
    const { isFetching, isSuccess, data } = useAtomValue(checkTokenQAtom);

    const setEmailVerifiedAtom = useSetAtom(emailIsVerifiedAtom);

    useEffect(() => {
        if (data != undefined) setEmailVerifiedAtom(data);
    }, [data]);

    return {
        isLoading: isFetching,
        isSuccess,
        isEmailVerified: data != undefined ? data : true,
    };
}
