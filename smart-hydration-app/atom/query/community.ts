import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { authTokenAtom } from "../user";
import { ENDPOINTS, request } from "@/util/fetch";

export const createCommunityMAtom = atomWithMutation((get) => ({
    mutationKey: ["create-community", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { name: string }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.CREATE_COMMUNITY, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }
    },
}));

export const updateCommunityMAtom = atomWithMutation((get) => ({
    mutationKey: ["update-community", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { name: string }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.UPDATE_COMMUNITY, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }
    },
}));

export const deleteCommunityMAtom = atomWithMutation((get) => ({
    mutationKey: ["delete-community", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.DELETE_COMMUNITY, {
            method: "post",
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }
    },
    onSuccess: () => {},
}));

{
    /*export const getCommunityMembersMAtom = atomWithQuery((get) => ({
    queryKey: ["get-community-members", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    // TODO: replace this user interface with the expected one from the db
    queryFn: async (formData: { community_id: string }): Promise<{name: string, id: string}[]> => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.COMMUNITY_MEMBER, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
          throw new Error("Cannot retrieve members list");
        }

        return response.json();
    }
}));
*/
}

export const linkJugsToCommunityMemberMAtom = atomWithMutation((get) => ({
    mutationKey: ["/community/link-jug-to-member", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (jugIds: string[], communityMember: string) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.LINK_JUG_TO_COMMUNITY_MEMBER, {
            method: "post",
            body: { jugIds: jugIds, communityMember: communityMember },
            auth: token as string,
        });
        if (!response.ok) {
            alert("Cannot add jug");
            throw new Error("Jug could not be linked to community member");
        }
        return;
    },
    onSuccess: () => {
        console.log("Linked jugs to user");
    },
}));
