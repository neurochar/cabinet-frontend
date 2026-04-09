import type { V1RefreshResponse } from '~/api/generated/Api';
import { tryToCatchApiErrors } from '~/shared/errors/errors';
import { setTokens } from './setAuthData';

export const doRefresh = async (): Promise<void> => {
    try {
        const result = await $fetch<V1RefreshResponse>('/api/auth/refresh', {
            method: 'POST',
        });

        setTokens({
            accessJWT: result.tokens!.accessJwt,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
