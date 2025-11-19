import { FetchError } from 'ofetch';
import { GetDefaultHeaders } from '~/shared/api/headers';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const query = getQuery(event);

    const codeID = String(query.code_id ?? '');
    const code = String(query.code ?? '');

    if (!codeID || !code) {
        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        setResponseStatus(event, 400);
        return 'Bad request';
    }

    try {
        await $fetch('/v1/auth/verify-email', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: GetDefaultHeaders(),
            params: {
                code: code,
                code_id: codeID,
            },
        });

        const url = '/';

        event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return `<div style="font-size:20px">Аккаунт подтвержден, вы можете <a href="${url}">авторизоваться</a>.</div>`;
    } catch (e: unknown) {
        if (e instanceof FetchError && e.statusCode) {
            setResponseStatus(event, e.statusCode);
            return e.data;
        }

        throw e;
    }
});
