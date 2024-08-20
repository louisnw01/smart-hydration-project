import { DeviceInfo, ITimeSeries } from "@/interfaces/device";
import { ENDPOINTS } from "@/util/fetch";
import { atom } from "jotai";
import { selectedMemberAtom } from "../community";
import { authTokenAtom } from "../user";
import { atomWithQueryDerivation, atomWithQueryInfo } from "./common";
import { userInfoQAtom } from "./user";

export const getJugDataQAtom = atomWithQueryInfo<DeviceInfo[]>({
    queryKey: "get-jug-data",
    endpoint: ENDPOINTS.DEVICE_INFO,
    enabled: (get) => !!get(authTokenAtom),
});

export const patientJugDataAtom = atom((get) => {
    const jugDataAtom = get(getJugDataQAtom);
    const member = get(selectedMemberAtom);
    let data;
    if (jugDataAtom.data) {
        data = jugDataAtom.data.filter(
            (device) => device.jugUserId == member?.id,
        );
    }
    return { ...jugDataAtom, data };
});

// export const getPatientJugDataQAtom = atomWithQueryInfo<DeviceInfo[]>({
//     queryKey: (get) => [
//         "get-patient-jug-data",
//         get(authTokenAtom),
//         get(selectedMemberAtom),
//     ],
//     endpoint: ENDPOINTS.DEVICE_INFO,
//     query: (get) => ({
//         jug_user_id: get(selectedMemberAtom)?.id,
//     }),
//     enabled: (get) => !!get(authTokenAtom) && !!get(selectedMemberAtom),
// });

export const historicalPatientJugDataQAtom = atomWithQueryInfo<ITimeSeries[]>({
    queryKey: (get) => [
        "historical-patient",
        get(authTokenAtom),
        get(selectedMemberAtom),
    ],
    endpoint: ENDPOINTS.FETCH_HISTORICAL_JUG_DATA,
    query: (get) => ({
        jug_user_id: get(selectedMemberAtom)?.id,
        timestamp: 0,
    }),
    enabled: (get) => !!get(authTokenAtom) && !!get(selectedMemberAtom),
});

export const getHydrationQAtom = atomWithQueryInfo<ITimeSeries[]>({
    queryKey: "/data/historical",
    endpoint: ENDPOINTS.FETCH_HISTORICAL_JUG_DATA,
    query: (get) => {
        const { data } = get(userInfoQAtom);
        const ts = new Date(2024, 5, 26).getTime();
        return {
            jug_user_id: data?.juguser,
            timestamp: ts / 1000,
        };
    },
    enabled: (get) => !!get(authTokenAtom) && !get(userInfoQAtom).isLoading,
});

export const dailyTargetAtom = atomWithQueryDerivation(
    userInfoQAtom,
    (data) => data?.target,
);
