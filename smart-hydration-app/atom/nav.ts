import { atom } from "jotai";

export const selectedPageAtom = atom<string>("home");
export const chartTimeWindowAtom = atom<"D" | "W" | "M" | "Y">("W");
