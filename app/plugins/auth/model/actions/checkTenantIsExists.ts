import { GetDefaultHeaders } from '~/shared/api/headers';
import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IAuthUserData } from '../types/auth.types';

export const checkTenantIsExists = async (tenantTextID: string): Promise<boolean> => {
    try {
        await useNuxtApp().$apiFetch<IAuthUserData>(`v1/tenants/is_exists/${tenantTextID}`, {
            method: 'GET',
            headers: GetDefaultHeaders(undefined),
        });

        return true;
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            if (err.code === 404) {
                return false;
            }
        }
        throw err;
    }
};
