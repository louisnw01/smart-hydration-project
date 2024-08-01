import { MemberInfo } from "@/interfaces/community";
import { ENDPOINTS, request, SERVER_URL } from "@/util/fetch";
import { atom } from "jotai";
import {
    atomWithMutation,
    atomWithQuery,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom, inviteCodeAtom } from "../user";

import { userInfoQAtom } from "../query";

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
    queryFn: async ({ queryKey: [, token] }): Promise<MemberInfo[]> => {
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
    enabled: !!get(authTokenAtom) && !!get(inviteCodeAtom),
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const code = get(inviteCodeAtom);

        const response = await request(ENDPOINTS.JOIN_COMMUNITY, {
            method: "post",
            auth: token as string,
            body: { code: code },
        });

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

export const communityNameQAtom = atomWithQuery((get) => ({
    queryKey: ["name-from-link", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const code = get(inviteCodeAtom);
        const response = await request(ENDPOINTS.NAME_FROM_LINK, {
            auth: token as string,
            query: { code },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom) && !!get(inviteCodeAtom),
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
    mutationFn: async (formData: {
        jugIds: string[];
        communityMember: number;
    }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.LINK_JUG_TO_COMMUNITY_MEMBER, {
            method: "post",
            body: formData,
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

export async function fetchCommunityJugData(jugUserId: number, token: string) {
    const response = await request(ENDPOINTS.FETCH_COMMUNITY_JUG_LIST, {
        query: { jug_user_id: jugUserId },
        auth: token as string,
    });

    if (!response.ok) {
        throw new Error("Jug Data for Community Could Not Be Found");
    }
    return await response.json();
}

export const getCommunityJugDataQAtom = atomWithQuery((get) => ({
    queryKey: ["get-community-jug-data", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<DeviceInfo[]> => {
        const { data } = get(userInfoQAtom);
        const jugUserId = data?.juguser;

        return await fetchCommunityJugData(jugUserId, token);
    },
    enabled: !!get(authTokenAtom) && !get(userInfoQAtom).isLoading,
}));
