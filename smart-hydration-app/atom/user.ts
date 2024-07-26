import { atom } from "jotai";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userNameAtom = atom<string>("");
export const registerInfoAtom = atom<Partial<RegistrationInfo>>({});

// Stored values that persist between open/closing the app
const storage = createJSONStorage(() => ({
    getItem: getItem,
    setItem: setItem,
    removeItem: deleteItemAsync,
}));

export const colorSchemeAtom = atomWithStorage("color-scheme", "Auto", storage);

export const notificationsAtom = atomWithStorage("notifications", "On", storage);

export const notificationFrequencyAtom = atomWithStorage("notification-frequency", "1 hour", storage);

export const authTokenAtom = atomWithStorage("auth-token", "", storage);

export const pushTokenAtom = atomWithStorage("push-token", "", storage);

export const nonSecureStorage = createJSONStorage(() => AsyncStorage);

export const drinkListAtom = atomWithStorage(
    "drink-list",
    [],
    nonSecureStorage,
);

export const dailyTargetAtom = atom(2200);
