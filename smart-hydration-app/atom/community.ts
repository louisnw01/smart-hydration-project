i
import { MemberInfo } from "@/interfaces/community";
import { atom } from "jotai";

import { ENDPOINTS, request } from "@/util/fetch";
import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import { authTokenAtom } from "./user";

export const membersAtom = atom(new Map());
export const selectedJugsForMemberAtom = atom<Set<string>>(new Set<string>());
export const selectedMemberAtom = atom<Partial<MemberInfo>>({});

export const linkJugToMemberMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/link-jug", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (jugIds: string[]) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.LINK_JUG_TO_USER, {
            method: "post",
            body: { jugIds: jugIds },
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("Jug could not be linked to user");
        }

        return;
    },
    onSuccess: () => {
        const queryClient = get(queryClientAtom);
        void queryClient.invalidateQueries({ queryKey: ["get-jug-data"] });
        void queryClient.invalidateQueries({
            queryKey: ["/data/historical"],
        });
    },
}));
