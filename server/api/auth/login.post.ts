import { FetchError } from 'ofetch';
import { AUTH_REFRESH_TOKEN_KEY } from '~/plugins/auth/model/const/const';
import { GetDefaultHeaders } from '~/shared/api/headers';

interface RequestDTO {
    email: string;
    password: string;
    tenantTextID: string;
}

type BackendResponseDTO = {
    accessJWT: string;
    refreshLifeSec: number;
    refreshJWT: string;
    [key: string]: any;
};

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const request = await readBody<RequestDTO>(event);
    if (typeof request?.email !== 'string' || typeof request?.password !== 'string' || typeof request?.tenantTextID !== 'string') {
        throw createError({
            statusCode: 400,
        });
    }

    try {
        const response = await $fetch<BackendResponseDTO>('/v1/auth/login', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: GetDefaultHeaders(),
            body: {
                email: request.email,
                password: request.password,
                tenantTextID: request.tenantTextID,
            },
        });

        const { refreshJWT, refreshLifeSec, ...otherResponse } = response;

        const host = getRequestHeader(event, 'host') || undefined;
        const cookieDomain = host?.split(':')[0];

        setCookie(event, AUTH_REFRESH_TOKEN_KEY, refreshJWT, {
            httpOnly: true,
            secure: config.public.isProd,
            sameSite: 'strict',
            path: '/api/auth',
            maxAge: refreshLifeSec,
            domain: cookieDomain,
        });

        return otherResponse;
    } catch (e: unknown) {
        if (e instanceof FetchError && e.statusCode) {
            setResponseStatus(event, e.statusCode);
            return e.data;
        }

        throw e;
    }
});
