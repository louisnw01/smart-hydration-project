import { atom } from "jotai";

export const wifiPairInfoAtom = atom<{ ssid: string; id: string } | null>(null);
