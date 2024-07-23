import { DeviceInfo } from "@/interfaces/device";
import { atom } from "jotai";
import { getJugDataQAtom } from "./query";

export const selectedJugIdAtom = atom<string | null>(null);
export const selectedDeviceAtom = atom<DeviceInfo | null>((get) => {
    const jugId = get(selectedJugIdAtom);
    const { data } = get(getJugDataQAtom);

    if (!data || !jugId) return null;

    return data.find((row) => row.id == jugId);
});
