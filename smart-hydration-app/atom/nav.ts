import { atom } from "jotai";

export const selectedPageAtom = atom<string>("home");
export const popupPageAtom = atom<"none" | "settings" | "devices" | "adddrink">(
  "none",
);
export const chartTimeWindowAtom = atom<"D" | "W" | "M" | "Y">("W");
