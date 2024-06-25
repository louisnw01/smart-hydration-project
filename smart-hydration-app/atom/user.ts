import { atom } from "jotai";

// change the user_id here (probs needs to be the unique user id, not the user name)
export const authTokenAtom = atom<string|null>('Neill');
export const authTokenIdAtom = atom<string|null>('329a6fa1-42ee-4636-925c-5c9bf57ad955');


// export const isLoggedInAtom = atom((get) => get(authTokenAtom) != null);