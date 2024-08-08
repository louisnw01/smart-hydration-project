import { DeviceInfo } from "@/interfaces/device";
import { ENDPOINTS } from "@/util/fetch";
import { authTokenAtom } from "../user";
import { atomWithMutationCustom } from "./common";

export const linkJugMAtom = atomWithMutationCustom<{
    jugIds: string[];
    jugUserId: number | null;
}>({
    mutationKey: "link-jug",
    endpoint: ENDPOINTS.LINK_JUG,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-jug-data"] });
        qc.invalidateQueries({ queryKey: ["/data/historical"] });
    },
});

export const unlinkJugMAtom = atomWithMutationCustom<{
    jugId: string;
    jugUserId: number;
}>({
    mutationKey: "unlink-jug",
    endpoint: ENDPOINTS.UNLINK_JUG,
    onSuccess: (get, qc, form) => {
        qc.setQueryData(
            ["get-jug-data", get(authTokenAtom)],
            (prev: DeviceInfo[]) => {
                return prev.filter(
                    (device) =>
                        device.id !== form.jugId ||
                        device.jugUserId !== form.jugUserId,
                );
            },
        );
        qc.invalidateQueries({ queryKey: ["/data/historical"] });
    },
});

export const updateJugNameMAtom = atomWithMutationCustom<{
    jugId: string;
    name: string;
}>({
    mutationKey: "/jug/update-name",
    endpoint: ENDPOINTS.UPDATE_JUG_NAME,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-jug-data"] });
    },
});
