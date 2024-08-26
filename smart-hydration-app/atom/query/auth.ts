import { ENDPOINTS, request } from "@/util/fetch";
import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import { registerInfoAtom } from "../user";
import { atomWithMutationCustom, atomWithQueryInfo } from "./common";

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
    onSuccess: () => {
        const qc = get(queryClientAtom);
        qc.invalidateQueries({ predicate: () => true });
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
    onSuccess: () => {
        const qc = get(queryClientAtom);
        qc.invalidateQueries({ predicate: () => true });
    },
}));

export const getUserExistsQAtom = atomWithQueryInfo({
    queryKey: (get) => ["/user/exists", get(registerInfoAtom).email],
    endpoint: ENDPOINTS.USER_EXISTS,
    query: (get) => ({ email: get(registerInfoAtom).email }),
    enabled: (get) => !!get(registerInfoAtom).email,
});

export const verifyEmailMAtom = atomWithMutationCustom<{ code: string }>({
    mutationKey: "/user/verify",
    endpoint: ENDPOINTS.VERIFY_EMAIL,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["check-token"] });
        qc.setQueryData(["check-token"], () => ({ status: 200 }));
    },
});

export const addPushTokenMAtom = atomWithMutationCustom<{ pushToken: string }>({
    mutationKey: "/user/add-push-token",
    endpoint: ENDPOINTS.ADD_PUSH_TOKEN,
});

export const removePushTokenMAtom = atomWithMutationCustom<{
    pushToken: string;
}>({
    mutationKey: "/user/remove-push-token",
    endpoint: ENDPOINTS.REMOVE_PUSH_TOKEN,
});

export const sendVerificationEmailMAtom = atomWithMutationCustom({
    mutationKey: "/user/send-verification-email",
    endpoint: ENDPOINTS.SEND_VERIFICATION_EMAIL,
});
