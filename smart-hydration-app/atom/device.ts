import { DeviceInfo } from "@/interfaces/device";
import { atom } from "jotai";
import { getJugDataQAtom, getPatientJugDataQAtom } from "./query";

export const selectedJugIdAtom = atom<string | null>(null);
export const selectedJugsAtom = atom<Set<string> | null>(new Set<string>());
export const selectedDeviceAtom = atom<DeviceInfo | undefined>((get) => {
    const jugId = get(selectedJugIdAtom);
    const { data, isLoading } = get(getJugDataQAtom);

    const { data: communityData, isLoading: communityIsLoading } = get(
        getPatientJugDataQAtom,
    );

    if (isLoading || communityIsLoading) return;

    return (
        data?.find((row) => row.id == jugId) ||
        communityData?.find((row) => row.id == jugId)
    );
});

// this holds the device id of the jug being used to measure the cup
export const isMeasuringNewCupSizeAtom = atom<string | null>(null);
