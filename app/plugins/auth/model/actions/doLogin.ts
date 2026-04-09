import type { V1LoginResponse } from '~/api/generated/Api';
import { tryToCatchApiErrors } from '~/shared/errors/errors';
import { setAuthUserData, setTokens } from './setAuthData';

export const doLogin = async (email: string, password: string, tenantTextID: string): Promise<void> => {
    try {
        const result = await $fetch<V1LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: {
                email,
                password,
                tenantTextID,
            },
        });

        setAuthUserData({
            account: result.account!,
            tenant: result.tenant!,
        });

        setTokens({
            accessJWT: result.tokens!.accessJwt,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
