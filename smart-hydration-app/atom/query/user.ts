import { ENDPOINTS, request } from "@/util/fetch";
import {
    atomWithMutation,
} from "jotai-tanstack-query";
import { authTokenAtom, userModeAtom } from "../user";

export const changeUserModeMAtom = atomWithMutation((get) => ({
    mutationKey: ["change-mode", get(authTokenAtom)],
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const mode = get(userModeAtom)
        const response = await request(ENDPOINTS.CHANGE_MODE, {
            method: "post",
            body: {mode: mode},
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }
    },
    enabled: !!get(authTokenAtom) && !!get(userModeAtom),
}));