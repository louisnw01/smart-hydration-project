import { atomWithQuery } from 'jotai-tanstack-query'
import {atom} from "jotai";

// TODO server_url should be in .env
const SERVER_URL = 'http://localhost:8085';

const ENDPOINTS = {
    HELLO_WORLD: '/',
    FETCH_COMMUNITY: '/community-jug-status/',
}

// change the user_id here (probs needs to be the unique user id, not the user name)
const authTokenAtom = atom('Neill')

export const helloWorldQAtom = atomWithQuery((get) => ({
    queryKey: ['hello-world'],
    queryFn: async () => {
        const result = await fetch(SERVER_URL+ENDPOINTS.FETCH_COMMUNITY);
        return result.json();
    },
}));

export const getJugDataAtom = atomWithQuery((get) => ({
    queryKey: ['getJugData', get(authTokenAtom)],
    queryFn: async () => {
        const token = get(authTokenAtom);
        const response = await fetch(SERVER_URL+ENDPOINTS.FETCH_COMMUNITY+`?user_id=${token}`);
        if (!response.ok) {
            throw new Error('Jug Data Could Not Be Found');
        }
        const result = await response.json();
        return result;
    }
}))
