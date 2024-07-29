import { ENDPOINTS, request, SERVER_URL } from "@/util/fetch";
import { atom } from "jotai";
import {
    atomWithMutation,
    atomWithQuery,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom } from "../user";

export const userHasCommunityAtom = atom((get) => {
    const { data, isLoading } = get(communityInfoQAtom);
    return !isLoading && !!data?.name;
});
export const communityNameAtom = atom((get) => {
    const { data, isLoading } = get(communityInfoQAtom);
    if (isLoading) return;
    return data?.name;
});
export const isCommunityOwnerAtom = atom((get) => {
    const { data, isLoading } = get(communityInfoQAtom);
    return !isLoading && data?.is_owner;
});

export const communityInfoQAtom = atomWithQuery((get) => ({
    queryKey: ["get-community-info", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const response = await request(ENDPOINTS.COMMUNITY_INFO, {
            auth: token as string,
        });
        if (!response.ok) {
            return null;
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
    retry: false,
}));

export const patientInfoQAtom = atomWithQuery((get) => ({
    queryKey: ["get-patient-info", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const response = await request(ENDPOINTS.PATIENT_INFO, {
            auth: token as string,
        });
        if (!response.ok) {
            throw new Error("");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const createCommunityMAtom = atomWithMutation((get) => ({
    mutationKey: ["create-community", get(authTokenAtom)],
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
    onSuccess: (data, formData) => {
        const qc = get(queryClientAtom);
        qc.setQueryData(["get-community-info", get(authTokenAtom)], {
            name: formData.name,
            is_owner: true,
        });
    },
    // only enabled if auth and user doesn't have a community
    enabled: !!get(authTokenAtom) && !get(userHasCommunityAtom),
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

export const communityInviteLinkQAtom = atomWithQuery((get) => ({
    queryKey: ["community-invite-link", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const response = await request(ENDPOINTS.COMMUNITY_GENERATE_INVITE, {
            auth: token as string,
        });
        if (!response.ok) {
            throw new Error("could not generate invite link");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom) && !!get(isCommunityOwnerAtom),
    staleTime: 0,
    initialData: undefined,
}));

export const joinCommunityMAtom = atomWithMutation((get) => ({
    mutationKey: ["join-community", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { code: string }) => {
        const token = get(authTokenAtom);
        const response = await request(
            SERVER_URL + `/community/invite/${formData.code}`,
            {
                method: "post",
                auth: token as string,
                rawUrl: true,
            },
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
    },
    onSuccess: () => {
        const qc = get(queryClientAtom);
        qc.invalidateQueries({ queryKey: ["get-community-info"] });
    },
}));

export const communityUsersQAtom = atomWithQuery((get) => ({
    queryKey: ["get-community-users", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const response = await request(ENDPOINTS.COMMUNITY_USERS, {
            auth: token as string,
        });
        if (!response.ok) {
            throw new Error("could not generate invite link");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom) && !!get(userHasCommunityAtom),
}));

export const deleteCommunityMemberMAtom = atomWithMutation((get) => ({
    mutationKey: ["delete-community-member", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { id: number }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.DELETE_COMMUNITY_MEMBER, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("could not delete community member");
        }
    },
    onSuccess: (data, formData) => {
        const qc = get(queryClientAtom);
        void qc.setQueryData(
            ["get-community-users", get(authTokenAtom)],
            (prev) => prev?.filter((member) => member.id != formData.id),
        );
    },
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
