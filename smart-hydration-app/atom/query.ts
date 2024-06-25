import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query'
import { authTokenAtom, authTokenIdAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import { DeviceInfo } from '@/interfaces/device';


export const linkJugToUserMAtom = atomWithMutation((get) => ({

    mutationKey: ['link-jug-to-user', get(authTokenIdAtom)],
    mutationFn: async (jugId: string) => {
        const token = get(authTokenAtom);

        const response = await request(ENDPOINTS.LINK_JUG_TO_USER, {method: "post", 
            body: {'userId': token, 'jugId': jugId}})

            if (!response.ok) {
                throw new Error('Jug could not be linked to user');
            }
    
            return await response.json();
        } 
    }))

export const unlinkJugFromUserMAtom = atomWithMutation((get) => ({
        
        mutationKey: ['unlink-jug-from-user', get(authTokenIdAtom)],
        
        mutationFn: async (jugId: string) => {
            const token = get(authTokenIdAtom);
            const response = await request(ENDPOINTS.UNLINK_JUG_FROM_USER, {method: "post", 
                body: {userId: token, jugId: jugId

                }})
    
                if (!response.ok) {
                    throw new Error('Jug could not be unlinked from user');
                }
        
                return;
            } 
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
