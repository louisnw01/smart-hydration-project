import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { getItemAsync, setItemAsync } from "expo-secure-store"

const _authTokenAtom = atom<string|null>(null);

export const authTokenAtom = atom((get) => get(_authTokenAtom),
async (get, set, update: string) => {
    set(_authTokenAtom, update);
    setItemAsync('auth_token', update);
    }
);

export const isLoggedInAtom = atom((get) => get(authTokenAtom) != null);

export const authTokenInitEAtom = atomEffect((get, set) => {
    getItemAsync('auth_token').then((token) => {
        if (token) {
            set(authTokenAtom, token);
        }
    })
})
