import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { RegistrationInfo } from "@/interfaces/user";

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

// export const onboardingRouterAtom = atom<string>('login-register');
// export const registerInfoAtom = atom<Partial<RegistrationInfo>|null>(null)
