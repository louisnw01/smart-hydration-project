import { JugUserInfo } from "@/interfaces/jug-user";
import { atom } from "jotai";

export const jugUserInfoAtom = atom<Partial<JugUserInfo>>({});
