import { atom } from "jotai";
import {
    getItem,
    setItem,
    setItemAsync,
    deleteItemAsync,
} from "expo-secure-store";
import { RegistrationInfo } from "@/interfaces/user";
import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";

const _authTokenAtom = atom<string | null>(null);

export const authTokenAtom = atom(
    (get) => get(_authTokenAtom),
    async (get, set, update: string) => {
        set(_authTokenAtom, update);
        setItemAsync("auth_token", update);
    },
);

export const isLoggedInAtom = atom((get) => get(authTokenAtom) != null);


export const userNameAtom = atom<string | null>(null);
export const registerInfoAtom = atom<Partial<RegistrationInfo>>({});

// Stored values that persist between open/closing the app
const storage = createJSONStorage(() => ({
    getItem: getItem,
    setItem: setItem,
    removeItem: deleteItemAsync,
}));

export const colorSchemeAtom = atomWithStorage("color-scheme", false, storage);
