import type { FetchError } from 'ofetch';
import type { V1LoginRequest, V1LoginResponse } from '~/api/generated/Api';
import { AUTH_REFRESH_TOKEN_KEY } from '~/plugins/auth/model/const/const';
import { GetDefaultHeaders } from '~/shared/api/headers';

interface RequestDTO {
    email: string;
    password: string;
    tenantTextID: string;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const request = await readBody<RequestDTO>(event);
    if (typeof request?.email !== 'string' || typeof request?.password !== 'string' || typeof request?.tenantTextID !== 'string') {
        throw createError({
            statusCode: 400,
        });
    }

    const req: V1LoginRequest = {
        email: request.email,
        password: request.password,
        tenantTextId: request.tenantTextID,
    };

    try {
        const response = await $fetch<V1LoginResponse>('/v1/tenant/auth/login', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: GetDefaultHeaders(event),
            body: req,
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
