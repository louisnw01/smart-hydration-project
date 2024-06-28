import { atomWithQuery, atomWithMutation, queryClientAtom } from 'jotai-tanstack-query'
import { authTokenAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import { DeviceInfo } from '@/interfaces/device';
import { registerInfoAtom } from '@/components/onboarding-router';
import { useAtomValue, useSetAtom } from "jotai";

export const linkJugToUserMAtom = atomWithMutation((get) => ({

    mutationKey: ['link-jug-to-user', get(authTokenAtom)],
    enabled: !!get(authTokenAtom),
    mutationFn: async (jugId: string) => {
        
        const token = get(authTokenAtom);
        alert(token);
        const response = await request(ENDPOINTS.LINK_JUG_TO_USER, {method: "post", 
            body: {jugId: jugId},
            auth: token as string})

            if (!response.ok) {
                throw new Error('Jug could not be linked to user');
            }
    
            return;
        },
        onSuccess: () => {
            const queryClient = get(queryClientAtom)
            void queryClient.invalidateQueries({queryKey:['get-jug-data']})
        },
    }))

export const unlinkJugFromUserMAtom = atomWithMutation((get) => ({
        
        mutationKey: ['unlink-jug-from-user', get(authTokenAtom)],
        
        mutationFn: async (jugId: string) => {
            const token = get(authTokenAtom);
            alert(token);
            const response = await request(ENDPOINTS.UNLINK_JUG_FROM_USER, {method: "post", 
                body: {jugId: jugId},
                auth: token as string})
    
                if (!response.ok) {
                    throw new Error('Jug could not be unlinked from user');
                }
        
                return;
            }, 
        
        onSuccess: () => {
            const queryClient = get(queryClientAtom)
            void queryClient.invalidateQueries({queryKey:['get-jug-data']})
        },
    }))



export const getJugDataQAtom = atomWithQuery((get) => ({
    queryKey: ['get-jug-data', get(authTokenAtom)],
    queryFn: async ({queryKey: [, token]}): Promise<DeviceInfo[]> => {
        const response = await request(ENDPOINTS.FETCH_COMMUNITY,
            {auth: token as string}
        )

        if (!response.ok) {
            throw new Error('Jug Data Could Not Be Found');
        }

        return await response.json();
    },
    enabled: !!get(authTokenAtom),
}))


export const loginMAtom = atomWithMutation((get) => ({
    mutationKey: ['login'],
    mutationFn: async (formData: {email: string, password: string}) => {
        const response = await request(ENDPOINTS.LOGIN, {
            method: 'post',
            body: formData,
        })
        

        const object = await response.json()

        if (!response.ok) {
            throw new Error(object.detail);
        }

        return object.access_token;
    },

    // onSuccess: () => {
    //     const setAuthToken = useSetAtom(authTokenAtom);
    //     const queryClient = get(queryClientAtom);
    //     const token = queryClient.getQueryData(['login']);
    //     setAuthToken(token as string);
    // },

}));

export const registerMAtom = atomWithMutation((get) => ({
    mutationKey: ['register'],
    mutationFn: async () => {
        const registrationInfo = get(registerInfoAtom);
        if (!registrationInfo) return;

        const response = await request(ENDPOINTS.REGISTER, {
            method: 'post',
            body: registrationInfo,
        })

        if (!response.ok) {
            return 'failure';
        }

        const object = await response.json()
        alert(object.access_token)
        return object.access_token;
    }
}));
