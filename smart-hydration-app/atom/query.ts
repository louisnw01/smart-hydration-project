import { atomWithQuery } from 'jotai-tanstack-query'
import {atom} from "jotai";
import { authTokenAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import {DeviceInfo, TrendsInfo} from '@/interfaces/device';


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

export const getHydrationAtom = atomWithQuery((get) => ({
    queryKey: ['get-daily-hydration', get(authTokenAtom)],
    queryFn: async ({queryKey: [, token]}): Promise<TrendsInfo[]> => {
        const response = await request(ENDPOINTS.FETCH_DAILY_HYDRATION, {
            query: {
                jug_id: 'jug001505',
                day: '2024/06/27'
            }
        })

        if (!response.ok) {
            throw new Error('Jug Data Could Not Be Found');
        }
        return await response.json();
    }
}))
