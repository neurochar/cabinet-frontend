import type { FetchError } from 'ofetch';
import type { V1RefreshResponse } from '~/api/generated/Api';
import { AUTH_REFRESH_TOKEN_KEY } from '~/plugins/auth/model/const/const';
import { GetDefaultHeaders } from '~/shared/api/headers';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const refreshFromCookie = getCookie(event, AUTH_REFRESH_TOKEN_KEY);

    if (!refreshFromCookie) {
        throw createError({
            statusCode: 401,
        });
    }

    try {
        const response = await $fetch<V1RefreshResponse>('/v1/tenant/auth/refresh', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: GetDefaultHeaders(event),
            body: {
                refreshToken: refreshFromCookie,
            },
        });

        const { refreshJwt, refreshLifeSec } = response.tokens!;
        response.tokens!.refreshJwt = '';
        response.tokens!.refreshLifeSec = 0;

        const host = getRequestHeader(event, 'host') || undefined;
        const cookieDomain = host?.split(':')[0];

        setCookie(event, AUTH_REFRESH_TOKEN_KEY, refreshJwt, {
            httpOnly: true,
            secure: config.public.isProd,
            sameSite: 'strict',
            path: '/api/auth',
            maxAge: refreshLifeSec,
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
