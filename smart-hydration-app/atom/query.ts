import { atom, useAtom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'

// TODO server_url should be in .env
const SERVER_URL = 'http://localhost:8085';

const ENDPOINTS = {
    HELLO_WORLD: '/',
}

export const helloWorldQAtom = atomWithQuery((get) => ({
    queryKey: ['hello-world'],
    queryFn: async () => {
        const res = await fetch(SERVER_URL+ENDPOINTS.HELLO_WORLD);
        return res.json();
    },
}));