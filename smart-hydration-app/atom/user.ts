import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { atom } from "jotai";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";

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

export const isInCommunityAtom = atom(false);
