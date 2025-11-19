import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IAuthTokens, IAuthUserData } from '../types/auth.types';
import { setAuthUserData, setTokens } from './setAuthData';

export const doLogin = async (email: string, password: string, tenantTextID: string): Promise<void> => {
    try {
        const result = await $fetch<IAuthUserData & IAuthTokens>('/api/auth/login', {
            method: 'POST',
            body: {
                email,
                password,
                tenantTextID,
            },
        });

        setAuthUserData({
            account: result.account,
            tenant: result.tenant,
        });

        setTokens({
            accessJWT: result.accessJWT,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
