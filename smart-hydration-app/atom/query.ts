import { atomWithQuery } from 'jotai-tanstack-query'
import {atom} from "jotai";
import { authTokenAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import { DeviceInfo } from '@/interfaces/device';


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
export const getJugDataQAtom = atomWithQuery((get) => ({
    queryKey: ['get-jug-data', get(authTokenAtom)],
    queryFn: async ({queryKey: [, token]}): Promise<DeviceInfo[]> => {
        const response = await request(ENDPOINTS.FETCH_COMMUNITY, {query: {user_id: token}})

        if (!response.ok) {
            throw new Error('Jug Data Could Not Be Found');
        }

        return await response.json();
    }
}))
