import { atomWithQuery } from 'jotai-tanstack-query'
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
