import {atom} from "jotai";

export const userNameAtom = atom<string>("");
export const jugUserInfoAtom = atom<Partial<JugUserInfo>>({});