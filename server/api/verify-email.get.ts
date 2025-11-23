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
            headers: GetDefaultHeaders(event),
            params: {
                code: code,
                code_id: codeID,
            },
        });

        const url = '/?account-verified=true';

        sendRedirect(event, url, 302);
        return;
    } catch (e: unknown) {
        if (e instanceof FetchError && e.statusCode) {
            setResponseStatus(event, e.statusCode);
            return e.data;
        }

        throw e;
    }
});
