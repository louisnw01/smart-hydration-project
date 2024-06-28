import { atomWithQuery } from "jotai-tanstack-query";
import { atom } from "jotai";
import { authTokenAtom } from "./user";
import { ENDPOINTS, request } from "@/util/fetch";
import { DeviceInfo, TrendsInfo } from "@/interfaces/device";

export const getJugDataQAtom = atomWithQuery((get) => ({
  queryKey: ["get-jug-data", get(authTokenAtom)],
  queryFn: async ({ queryKey: [, token] }): Promise<DeviceInfo[]> => {
    const response = await request(ENDPOINTS.FETCH_COMMUNITY, {
      query: { user_id: token },
    });

    if (!response.ok) {
      throw new Error("Jug Data Could Not Be Found");
    }

    return await response.json();
  },
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

    if (!response.ok) {
      throw new Error("Jug Data Could Not Be Found");
    }
    return await response.json();
  },
  enabled: !!get(authTokenAtom),
}));
