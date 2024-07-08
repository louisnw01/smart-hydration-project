import {
    atomWithQuery,
    atomWithMutation,
    queryClientAtom,
} from "jotai-tanstack-query";
import { authTokenAtom, registerInfoAtom } from "./user";
import { ENDPOINTS, request } from "@/util/fetch";
import { DeviceInfo, TrendsInfo } from "@/interfaces/device";

import { useAtomValue, useSetAtom } from "jotai";

export const linkJugToUserMAtom = atomWithMutation((get) => ({
    mutationKey: ["link-jug-to-user", get(authTokenAtom)],
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
    },
}));

export const unlinkJugFromUserMAtom = atomWithMutation((get) => ({
    mutationKey: ["unlink-jug-from-user", get(authTokenAtom)],
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

        return;
    },

    onSuccess: () => {
        const queryClient = get(queryClientAtom);
        void queryClient.invalidateQueries({ queryKey: ["get-jug-data"] });
    },
}));

export const deleteUser = atomWithMutation((get) => ({
  mutationKey: ["delete-user-s", get(authTokenAtom)],
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
  onSuccess: () => {
    
      const queryClient = get(queryClientAtom);
      //void queryClient.invalidateQueries({ queryKey: ["get-jug-data"] });
  },
}));











export const getJugDataQAtom = atomWithQuery((get) => ({
    queryKey: ["get-jug-data", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<DeviceInfo[]> => {
        const response = await request(ENDPOINTS.FETCH_COMMUNITY, {
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("Jug Data Could Not Be Found");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const getUserQAtom = atomWithQuery((get) => ({
    queryKey: ["user", get(authTokenAtom)],
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

export const getHydrationAtom = atomWithQuery((get) => ({
    queryKey: ["historial-jug-data", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<TrendsInfo[]> => {
        const ts = new Date(2024, 5, 26).getTime();
        const response = await request(ENDPOINTS.FETCH_HISTORICAL_JUG_DATA, {
            query: {
                juguser_id: 1,
                timestamp: ts / 1000,
            },
        });
        return await response.json();
    },
}));

export const getTodaysIntakeAtom = atomWithQuery((get) => ({
    queryKey: ["todays-total-intake", get(authTokenAtom)],
    queryFn: async ({ queryKey: [, token] }): Promise<number> => {
        const response = await request(ENDPOINTS.GET_TODAYS_INTAKE, {
            auth: token as string,
        });

        if (!response.ok) {
            throw new Error("User Total Intake Could Not Be Found");
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}));

export const loginMAtom = atomWithMutation((get) => ({
    mutationKey: ["login"],
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
    // onSuccess: () => {
    //     const setAuthToken = useSetAtom(authTokenAtom);
    //     const queryClient = get(queryClientAtom);
    //     const token = queryClient.getQueryData(['login']);
    //     setAuthToken(token as string);
    // },
}));

export const registerMAtom = atomWithMutation((get) => ({
    mutationKey: ["register"],
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
