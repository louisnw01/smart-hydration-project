import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { atom, useAtomValue, WritableAtom } from "jotai";
import { UserMode } from "@/constants/user";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/vanilla/utils";
import { RegistrationInfo } from "@/interfaces/user";

export const registerInfoAtom = atom<Partial<RegistrationInfo>>({});

// Stored values that persist between open/closing the app
const storage = createJSONStorage<any>(() => ({
    getItem: getItem,
    setItem: setItem,
    removeItem: deleteItemAsync,
}));

export const colorSchemeAtom = atomWithStorage("color-scheme", "Auto", storage);

export const notificationsAtom = atomWithStorage(
    "notifications",
    "On",
    storage,
);

export const notificationFrequencyAtom = atomWithStorage(
    "notification-frequency",
    "1 hour",
    storage,
);

export const authTokenAtom = atomWithStorage("auth-token", "", storage);

export const pushTokenAtom = atomWithStorage("push-token", "", storage);

export const userModeAtom = atomWithStorage("user-mode", UserMode.STANDARD , storage);

export const nonSecureStorage = createJSONStorage<any>(() => AsyncStorage);

export const drinkListAtom = atomWithStorage(
    "drink-list",
    [],
    nonSecureStorage,
);

export const emailIsVerifiedAtom = atom(false);

export const inviteCodeAtom = atom("");

export const communityTabVisible = atomWithStorage<boolean>("community-tab-visible", true, nonSecureStorage);

export const unitsAtom = atomWithStorage<string>("units", "ml", storage);

export const dailyTargetAtom = atomWithStorage<number>("daily-target", 2200, nonSecureStorage);

export const unitConverter = (val:number, unit:string) => {
    switch(unit){
        case("ml"):
            return val;
        case("oz"):
            return val * 0.033814;
        default:
            return val;
    }
}

export const reverseUnitConverter = (val:number, unit:string) => {
    switch(unit){
        case("ml"):
            return val;
        case("oz"):
            return val * 29.5735;
        default:
            return val;
    }
}


