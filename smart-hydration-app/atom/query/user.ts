import { UserInfo } from "@/interfaces/user";
import { ENDPOINTS } from "@/util/fetch";
import {
    authTokenAtom,
    emailIsVerifiedAtom,
    notificationFrequencyAtom,
    notificationsAtom,
    pushTokenAtom,
    userModeAtom,
} from "../user";
import {
    atomWithMutationCustom,
    atomWithQueryDerivation,
    atomWithQueryInfo,
} from "./common";

export const changeUserModeMAtom = atomWithMutationCustom({
    mutationKey: "change-mode",
    endpoint: ENDPOINTS.CHANGE_MODE,
    body: (get) => ({ mode: get(userModeAtom) }),
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({
            queryKey: ["get-patient-info"],
        });
        qc.invalidateQueries({ queryKey: ["/data/historical"] });
        qc.invalidateQueries({ queryKey: ["historical-patient"] });
        qc.setQueryData(["/data/historical"], () => undefined);
        qc.setQueryData(["historical-patient"], () => undefined);
    },
});

export const updateUserTargetMAtom = atomWithMutationCustom<{
    newValue: number;
}>({
    mutationKey: "/user/update-user-target",
    endpoint: ENDPOINTS.UPDATE_USER_TARGET,
    onSuccess: (get, qc, form) => {
        qc.setQueryData(
            ["user-info", get(authTokenAtom)],
            (prev: UserInfo) => ({ ...prev, target: form.newValue }),
        );
    },
});

export const userInfoQAtom = atomWithQueryInfo<UserInfo>({
    queryKey: "user-info",
    endpoint: ENDPOINTS.USER_INFO,
    enabled: (get) => !!get(authTokenAtom) && !!get(emailIsVerifiedAtom),
});

export const userJugUserIdAtom = atomWithQueryDerivation(
    userInfoQAtom,
    (data) => data.juguser,
);

export const deleteUserMAtom = atomWithMutationCustom({
    mutationKey: "/user/delete",
    endpoint: ENDPOINTS.DELETE_USER,
});

// TODO temporary, for linking during MVP
export const getAllJugsQAtom = atomWithQueryInfo<string[]>({
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
