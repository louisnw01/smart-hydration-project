import { DeviceInfo } from "@/interfaces/device";
import { ENDPOINTS } from "@/util/fetch";
import { authTokenAtom } from "../user";
import { atomWithMutationCustom, atomWithQueryInfo } from "./common";

export const addDrinkMAtom = atomWithMutationCustom<{
    juguser_id: number;
    timestamp: number;
    name: string;
    capacity: number;
}>({
    mutationKey: "add-drink",
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

export const addCustomCupMAtom = atomWithMutationCustom<{
    size: number;
    name: string;
    juguser: number;
}>({
    mutationKey: "add-custom-cup",
    endpoint: ENDPOINTS.ADD_CUSTOM_CUP,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({
            queryKey: ["get-custom-cups"],
        });
    },
});

export const customCupsQAtom = atomWithQueryInfo<{
    [key: string]: {
        name: string;
        size: number;
    }[];
}>({
    queryKey: "get-custom-cups",
    endpoint: ENDPOINTS.GET_CUSTOM_CUPS,
    enabled: (get) => !!get(authTokenAtom),
});
