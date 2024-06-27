import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query'
import { authTokenAtom } from './user';
import { ENDPOINTS, request } from '@/util/fetch';
import { DeviceInfo } from '@/interfaces/device';
import { registerInfoAtom } from '@/components/onboarding-router';


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
    }
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

export const updateMAtom = atomWithMutation((get) => ({
    mutationKey: ['update'],
    mutationFn: async (formData: {id: number, key: string, value: string}) => {
        const response = await request(ENDPOINTS.UPDATE, {
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
