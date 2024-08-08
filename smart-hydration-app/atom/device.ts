import { DeviceInfo } from "@/interfaces/device";
import { atom } from "jotai";

export const selectedDeviceAtom = atom<DeviceInfo | null>(null);
// this holds the device id of the jug being used to measure the cup
export const isMeasuringNewCupSizeAtom = atom<string | null>(null);
