import { DeviceInfo } from "@/interfaces/device";
import { atom } from "jotai";

export const selectedDeviceAtom = atom<DeviceInfo | null>(null);
