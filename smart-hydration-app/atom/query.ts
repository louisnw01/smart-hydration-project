import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query'
import {atom} from "jotai";
import { authTokenAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import { DeviceInfo } from '@/interfaces/device';


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


export const loginMAtom = atomWithMutation((get) => ({
    mutationKey: ['login'],
    mutationFn: async (formData: {email: string, password: string}) => {
        const response = await request(ENDPOINTS.LOGIN, {
            method: 'post',
            body: formData,
        })

        if (!response.ok) {
            return 'failure';
        }

        const object = await response.json()
        return object.access_token;
    }
}));

export const registerMAtom = atomWithMutation((get) => ({
    mutationKey: ['register'],
    mutationFn: async (formData: {email: string, password: string, name: string}) => {
        const response = await request(ENDPOINTS.REGISTER, {
            method: 'post',
            body: formData,
        })

        if (!response.ok) {
            return 'failure';
        }

        const object = await response.json()
        return object.access_token;
    }
}));
