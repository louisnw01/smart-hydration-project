import { atom } from "jotai";

// change the user_id here (probs needs to be the unique user id, not the user name)
export const authTokenAtom = atom<string|null>('Neill');
export const authTokenIdAtom = atom<string|null>('1');


// export const isLoggedInAtom = atom((get) => get(authTokenAtom) != null);