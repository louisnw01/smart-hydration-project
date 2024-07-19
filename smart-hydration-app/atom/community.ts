import { atom } from 'jotai'
import {
    atomWithMutation,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom } from "./user";
import { ENDPOINTS, request } from "@/util/fetch";


export const userHasCommunityAtom = atom(false);
export const communityNameAtom = atom('');
export const membersAtom = atom(new Map());
export const selectedJugsForMemberAtom = atom<Set<string>>(new Set<string>);


//update this so it only works on the front end for now
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
