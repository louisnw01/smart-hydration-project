import { UserInfo } from "@/interfaces/user";
import { ENDPOINTS, request } from "@/util/fetch";
import { atomWithMutation } from "jotai-tanstack-query";
import {
    authTokenAtom,
    emailIsVerifiedAtom,
    notificationFrequencyAtom,
    notificationsAtom,
    pushTokenAtom,
    userModeAtom,
} from "../user";
import { atomWithMutationCustom, atomWithQueryInfo } from "./common";

export const changeUserModeMAtom = atomWithMutation((get) => ({
    mutationKey: ["change-mode", get(authTokenAtom)],
    mutationFn: async () => {
        const token = get(authTokenAtom);
        const mode = get(userModeAtom);
        const response = await request(ENDPOINTS.CHANGE_MODE, {
            method: "post",
            body: { mode: mode },
            auth: token as string,
        });

        if (!response.ok) {
            return;
        }
    },
    enabled: !!get(authTokenAtom) && !!get(userModeAtom),
}));

export const updateUserTargetMAtom = atomWithMutationCustom<{
    newValue: number;
}>({
    mutationKey: "/user/update-user-target",
    endpoint: ENDPOINTS.UPDATE_USER_TARGET,
    onSuccess: (get, qc, form) => {
        qc.setQueryData(["get-user-target", get(authTokenAtom)], {
            target: form.newValue,
        });
    },
});

export const userInfoQAtom = atomWithQueryInfo<UserInfo>({
    queryKey: "user-info",
    endpoint: ENDPOINTS.USER_INFO,
    enabled: (get) => !!get(authTokenAtom) && !!get(emailIsVerifiedAtom),
});

export const deleteUserMAtom = atomWithMutationCustom({
    mutationKey: "/user/delete",
    endpoint: ENDPOINTS.DELETE_USER,
});

// TODO temporary, for linking during MVP
export const getAllJugsQAtom = atomWithQueryInfo<{
    real: string[];
    fake: string[];
}>({
    queryKey: "temp-get-jugs",
    endpoint: ENDPOINTS.GET_ALL_JUGS,
});

export const toggleNotificationsMAtom = atomWithMutationCustom({
    mutationKey: "/user/toggle-notifications",
    endpoint: ENDPOINTS.TOGGLE_NOTIFICATIONS,
    body: (get) => ({
        notificationSelection: get(notificationsAtom),
        pushToken: get(pushTokenAtom),
    }),
});

export const toggleNotificationsFrequencyMAtom = atomWithMutationCustom({
    mutationKey: "/user/toggle-notifications-frequency",
    endpoint: ENDPOINTS.TOGGLE_NOTIFICATIONS_FREQUENCY,
    body: (get) => ({
        notificationSelection: get(notificationFrequencyAtom),
        pushToken: get(pushTokenAtom),
    }),
});
