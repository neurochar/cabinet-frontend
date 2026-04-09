import type { FetchError } from 'ofetch';
import type { V1LogoutResponse } from '~/api/generated/Api';
import { AUTH_REFRESH_TOKEN_KEY } from '~/plugins/auth/model/const/const';
import { GetDefaultHeaders } from '~/shared/api/headers';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const authHeader = getRequestHeader(event, 'authorization');

    if (!authHeader) {
        throw createError({
            statusCode: 401,
        });
    }

    try {
        const headers = GetDefaultHeaders(event);
        headers.set('Authorization', authHeader);

        const response = await $fetch<V1LogoutResponse>('/v1/tenant/auth/logout', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers,
        });

        const host = getRequestHeader(event, 'host') || undefined;
        const cookieDomain = host?.split(':')[0];

        deleteCookie(event, AUTH_REFRESH_TOKEN_KEY, {
            httpOnly: true,
            secure: config.public.isProd,
            sameSite: 'strict',
            path: '/api/auth',
            domain: cookieDomain,
        });

        return response;
    } catch (e: unknown) {
        const err = e as FetchError;

        const statusCode = err?.statusCode ?? err?.response?.status;

        if (statusCode) {
            setResponseStatus(event, statusCode);
            return err.data;
        }

        throw e;
    }
});
