import { atomWithMutation } from "jotai-tanstack-query";
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
