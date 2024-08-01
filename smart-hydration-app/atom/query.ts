import {
    atomWithQuery,
    atomWithMutation,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom, registerInfoAtom } from "./user";
import { ENDPOINTS, request } from "@/util/fetch";
import { DeviceInfo, ITimeSeries } from "@/interfaces/device";
import { jugUserInfoAtom } from "./jug-user";
import { selectedMemberAtom } from "./community";
import { communityInfoQAtom } from "./query/community";

export const linkJugsToMemberMAtom = atomWithMutation((get) => ({
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
            throw new Error("Jug could not be linked to community member");
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

export const linkJugToUserMAtom = atomWithMutation((get) => ({
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

export const unlinkJugFromUserMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/unlink-jug", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (jugId: string) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.UNLINK_JUG_FROM_USER, {
            method: "post",
            body: { jugId: jugId },
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("Jug could not be unlinked from user");
        }
    },

    onSuccess: (data, jugId) => {
        const queryClient = get(queryClientAtom);
        void queryClient.setQueryData(
            ["get-jug-data", get(authTokenAtom)],
            (prev: DeviceInfo[]) => prev.filter((device) => device.id != jugId),
        );
        void queryClient.invalidateQueries({
            queryKey: ["/data/historical"],
        });
    },
}));

export const updateJugNameMAtom = atomWithMutation((get) => ({
    mutationKey: ["/jug/update-name", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { jugId: string; name: string }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.UPDATE_JUG_NAME, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("Could not update jug name");
        }

        return;
    },

    onSuccess: () => {
        const queryClient = get(queryClientAtom);
        void queryClient.invalidateQueries({ queryKey: ["get-jug-data"] });
    },
}));

export const deleteUser = atomWithMutation((get) => ({
    mutationKey: ["/user/delete", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.DELETE_USER, {
            method: "post",
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("User could not be deleted");
        }

        return;
    },
}));

export const updateUserTarget = atomWithMutation((get) => ({
    mutationKey: ["/user/update-user-target", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: { newValue: number }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.UPDATE_USER_TARGET, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            alert("Could not update user target");
        }

        return;
    },

    onSuccess: (data, formData) => {
        const queryClient = get(queryClientAtom);
        void queryClient.setQueryData(["get-user-target", get(authTokenAtom)], {
            target: formData.newValue,
        });
    },
}));

export const getUserTargetQAtom = atomWithQuery((get) => ({
    queryKey: ["get-user-target", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<DeviceInfo[]> => {
        const response = await request(ENDPOINTS.GET_USER_TARGET, {
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("User Target Could Not Be Found");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const sendVerificationEmailMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/send-verification-email", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.SEND_VERIFICATION_EMAIL, {
            method: "post",
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("Verification email could not be sent");
        }

        return;
    },
}));

export const userInfoQAtom = atomWithQuery((get) => ({
    queryKey: ["user-info", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<any> => {
        const response = await request(ENDPOINTS.USER_INFO, {
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("User Could Not Be Found");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export async function fetchJugData(jugUserId: number, token: string) {
    const response = await request(ENDPOINTS.FETCH_COMMUNITY, {
        query: { jug_user_id: jugUserId },
        auth: token as string,
    });

    if (!response.ok) {
        throw new Error("Jug Data Could Not Be Found");
    }
    return await response.json();
}

export const getJugDataQAtom = atomWithQuery((get) => ({
    queryKey: ["get-jug-data", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<DeviceInfo[]> => {
        const { data } = get(userInfoQAtom);
        const jugUserId = data?.juguser;

        return await fetchJugData(jugUserId, token);
    },
    enabled: !!get(authTokenAtom) && !get(userInfoQAtom).isLoading,
}));

export const getPatientJugDataQAtom = atomWithQuery((get) => ({
    queryKey: [
        "get-patient-jug-data",
        get(authTokenAtom),
        get(selectedMemberAtom),
    ],
    queryFn: async ({ queryKey: [, token, member] }): Promise<DeviceInfo[]> => {
        return await fetchJugData(member.id, token);
    },
    enabled: !!get(authTokenAtom) && !!get(selectedMemberAtom),
}));

export const updateMAtom = atomWithMutation((get) => ({
    mutationKey: ["/jug-user/update", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: {
        id: number;
        key: string;
        value: string;
    }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.UPDATE, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }

        const object = await response.json();
        return object.access_token;
    },
}));

export const getUserQAtom = atomWithQuery((get) => ({
    queryKey: ["/user/user-name", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<string> => {
        const response = await request(ENDPOINTS.FETCH_USER, {
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("User Could Not Be Found");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const getHydrationQAtom = atomWithQuery((get) => ({
    queryKey: ["/data/historical", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<ITimeSeries[]> => {
        const ts = new Date(2024, 5, 26).getTime();
        const response = await request(ENDPOINTS.FETCH_HISTORICAL_JUG_DATA, {
            query: {
                timestamp: ts / 1000,
            },
            auth: token,
        });
        if (!response.ok) {
            throw new Error();
        }
        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const loginMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/login"],
    mutationFn: async (formData: { email: string; password: string }) => {
        const response = await request(ENDPOINTS.LOGIN, {
            method: "post",
            body: formData,
        });

        const object = await response.json();

        if (!response.ok) {
            throw new Error(object.detail);
        }

        return object.access_token;
    },
}));

export const verifyEmailMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/verify", get(authTokenAtom)],
    mutationFn: async (formData: { code: string }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.VERIFY_EMAIL, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        const object = await response.json();

        if (!response.ok) {
            return object.detail;
        }

        return;
    },
}));

export const registerMAtom = atomWithMutation((get) => ({
    mutationKey: ["/user/register"],
    mutationFn: async () => {
        const registrationInfo = get(registerInfoAtom);
        if (!registrationInfo) return;

        const response = await request(ENDPOINTS.REGISTER, {
            method: "post",
            body: registrationInfo,
        });

        if (!response.ok) {
            return "failure";
        }

        const object = await response.json();
        return object.access_token;
    },
}));

export const createJugUserMAtom = atomWithMutation((get) => ({
    mutationKey: ["/jug-user/create", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const jugUserInfo = get(jugUserInfoAtom);
        if (!jugUserInfo) return;

        const response = await request(ENDPOINTS.CREATE_JUG_USER, {
            method: "post",
            body: jugUserInfo,
            auth: token as string,
        });
        if (!response.ok) {
            throw new Error("Jug User could not be added");
        }

        return;
    },
}));

// TODO temporary, for linking during MVP
export const getAllJugsQAtom = atomWithQuery((get) => ({
    queryKey: ["temp-get-jugs", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }) => {
        const response = await request(ENDPOINTS.GET_ALL_JUGS, {
            auth: token as string,
        });

        if (!response.ok) {
            return "failure";
        }

        return await response.json();
    },
}));

export const getUserExistsQAtom = atomWithQuery((get) => ({
    enabled: !!get(registerInfoAtom).email,
    queryKey: ["/user/exists", get(registerInfoAtom).email],
    queryFn: async ({ queryKey: [, email] }): Promise<boolean[]> => {
        const response = await request(ENDPOINTS.USER_EXISTS, {
            method: "get",
            query: { email },
        });

        if (!response.ok) {
            throw new Error("Get user exists request failed");
        }
        return await response.json();
    },
}));

export const addDrinkMAtom = atomWithMutation((get) => ({
    mutationKey: ["/jug-user/add-drink-event", get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (formData: {
        timestamp: number;
        name: string;
        capacity: number;
    }) => {
        const token = get(authTokenAtom);
        const response = await request(ENDPOINTS.ADD_DRINK, {
            method: "post",
            body: formData,
            auth: token as string,
        });

        if (!response.ok) {
            return "failure";
        }
    },
    onSuccess: (data, formData) => {
        const queryClient = get(queryClientAtom);
        void queryClient.setQueryData(
            ["/data/historical", get(authTokenAtom)],
            (prev: DeviceInfo[]) => [
                ...prev,
                { time: formData.timestamp * 1000, value: formData.capacity },
            ],
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
