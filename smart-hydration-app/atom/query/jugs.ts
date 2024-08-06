import { DeviceInfo } from "@/interfaces/device";
import { ENDPOINTS } from "@/util/fetch";
import { authTokenAtom } from "../user";
import { atomWithMutationCustom } from "./common";

export const linkJugToUserMAtom = atomWithMutationCustom<{ jugIds: string[] }>({
    mutationKey: "/user/link-jug",
    endpoint: ENDPOINTS.LINK_JUG_TO_USER,
    onSuccess: (get, qc, form) => {
        qc.invalidateQueries({ queryKey: ["get-jug-data"] });
        qc.invalidateQueries({ queryKey: ["/data/historical"] });
    },
});

export const unlinkJugFromUserMAtom = atomWithMutationCustom<{ jugId: string }>(
    {
        mutationKey: "/user/unlink-jug",
        endpoint: ENDPOINTS.UNLINK_JUG_FROM_USER,
        onSuccess: (get, qc, form) => {
            qc.setQueryData(
                ["get-jug-data", get(authTokenAtom)],
                (prev: DeviceInfo[]) =>
                    prev.filter((device) => device.id != form.jugId),
            );
            qc.invalidateQueries({ queryKey: ["/data/historical"] });
        },
    },
);

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
