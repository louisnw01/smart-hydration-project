import { DeviceInfo, ITimeSeries } from "@/interfaces/device";
import { ENDPOINTS } from "@/util/fetch";
import { selectedMemberAtom } from "../community";
import { authTokenAtom } from "../user";
import {
    atomWithMutationCustom,
    atomWithQueryDerivation,
    atomWithQueryInfo,
} from "./common";
import { userInfoQAtom } from "./user";

export const getJugDataQAtom = atomWithQueryInfo<DeviceInfo[]>({
    queryKey: "get-jug-data",
    endpoint: ENDPOINTS.FETCH_COMMUNITY,
    query: (get) => {
        const { data } = get(userInfoQAtom);
        return {
            jug_user_id: data?.juguser,
        };
    },
    enabled: (get) => !!get(authTokenAtom) && get(userInfoQAtom).isSuccess,
});

export const getPatientJugDataQAtom = atomWithQueryInfo<DeviceInfo[]>({
    queryKey: (get) => [
        "get-patient-jug-data",
        get(authTokenAtom),
        get(selectedMemberAtom),
    ],
    endpoint: ENDPOINTS.FETCH_COMMUNITY,
    query: (get) => ({
        jug_user_id: get(selectedMemberAtom)?.id,
    }),
    enabled: (get) => !!get(authTokenAtom) && !!get(selectedMemberAtom),
});

export const addDrinkMAtom = atomWithMutationCustom<{
    timestamp: number;
    name: string;
    capacity: number;
}>({
    mutationKey: "/jug-user/add-drink-event",
    endpoint: ENDPOINTS.ADD_DRINK,
    onSuccess: (get, qc, form) => {
        qc.setQueryData(
            ["/data/historical", get(authTokenAtom)],
            (prev: DeviceInfo[]) => [
                ...prev,
                { time: form.timestamp * 1000, value: form.capacity },
            ],
        );
    },
});

export const historicalPatientJugDataQAtom = atomWithQueryInfo<ITimeSeries[]>({
    queryKey: "historical-patient",
    endpoint: ENDPOINTS.FETCH_HISTORICAL_JUG_DATA,
    query: (get) => ({
        jug_user_id: get(selectedMemberAtom)?.id,
        timestamp: new Date(2024, 5, 26).getTime() / 1000,
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
