import { GetDefaultHeaders } from '~/shared/api/headers';
import { tryToCatchApiErrors } from '~/shared/errors/errors';
import { AUTH_ACCESS_TOKEN_KEY } from '../const/const';
import type { IAuthUserData } from '../types/auth.types';
import { setAuthUserData } from './setAuthData';

export const doAuth = async (): Promise<void> => {
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
    if (!accessToken) {
        return;
    }

    try {
        const result = await useNuxtApp().$apiFetch<IAuthUserData>('v1/auth/whoiam', {
            method: 'GET',
            headers: GetDefaultHeaders(undefined),
        });

        setAuthUserData(result);
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
