import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query'
import { atom } from "jotai";

// TODO server_url should be in .env
const SERVER_URL = 'http://localhost:8085';

const authTokenAtom=atom<string>("neill")

const ENDPOINTS = {
    HELLO_WORLD: '/',
}

export const helloWorldQAtom = atomWithQuery((get) => ({
    queryKey: ['hello-world'],
    queryFn: async () => {
        const result = await fetch(SERVER_URL+ENDPOINTS.HELLO_WORLD);
        return result.json();
    },
}));

export const linkJugToUserAtom = atomWithMutation((get) => ({

    mutationFn: async (jugId: string) => {
        const token = get(authTokenAtom);

        const result = await fetch(SERVER_URL+"/link-jug-to-user", {
            method: 'POST',
            body: {
                userId: token,
                jugId: jugId,
            }
        });
        return result.json();
    },

}))