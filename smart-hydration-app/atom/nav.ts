import { atom } from "jotai";

export const selectedPageAtom = atom<string>('home');
export const popupPageAtom = atom<string>('none');
