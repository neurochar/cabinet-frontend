import type { V1LogoutResponse } from '~/api/generated/Api';
import { tryToCatchApiErrors } from '~/shared/errors/errors';
import { AUTH_ACCESS_TOKEN_KEY } from '../const/const';
import { clearAuthUserData } from './clearAuthData';
import { clearTokens } from './setAuthData';

export const doLogout = async (): Promise<void> => {
    setTimeout(() => {
        const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);

        clearAuthUserData();
        clearTokens();

        try {
            $fetch<V1LogoutResponse>('/api/auth/logout', {
                method: 'POST',
                headers: {
                    Authorization: accessToken || '',
                },
            });
        } catch (e: unknown) {
            const err = tryToCatchApiErrors(e);
            console.error(err);
        }
    }, 100);

    navigateTo('/');
};
