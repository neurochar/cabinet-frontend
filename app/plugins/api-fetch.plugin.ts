import { GetDefaultHeaders } from '~/shared/api/headers';
import { ApiError } from '~/shared/errors/errors';
import { SingleFlight } from '~/shared/helpers/singleflight';
import { doLogout } from './auth/model';
import { doRefresh } from './auth/model/actions/doRefresh';
import { AUTH_ACCESS_TOKEN_KEY } from './auth/model/const/const';

export default defineNuxtPlugin({
    name: 'api-fetch',
    enforce: 'pre',
    async setup(nuxtApp) {
        const singleflight = new SingleFlight();

        const apiFetch = $fetch.create({
            baseURL: nuxtApp.$config.public.apiBase,
            retry: 1,
            retryStatusCodes: [401],
            retryDelay: 0,
            headers: GetDefaultHeaders(undefined),

            async onRequest({ options }) {
                if ((options as any)._meta === undefined) {
                    (options as any)._meta = {};
                }
                const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
                if (accessToken) {
                    options.headers.set('Authorization', `Bearer ${accessToken}`);
                }
            },

            async onResponseError({ response, options }) {
                if (response.status === 401 && (options as any)._meta.refresh_tried === undefined) {
                    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
                    if (!accessToken) {
                        console.error('no access token');
                        doLogout();
                        return;
                    }

                    const refreshRes = await singleflight.do<{ error?: unknown }>('refresh', async () => {
                        try {
                            await doRefresh();
                            return {};
                        } catch (e: unknown) {
                            if (e instanceof ApiError) {
                                if (e.code === 401) {
                                    doLogout();
                                }
                            }
                            return { error: e };
                        }
                    });

                    (options as any)._meta.refresh_tried = true;

                    if (refreshRes.value.error) {
                        console.error(refreshRes.value.error);
                    }
                }
            },
        });

        const apiFetchWithoutAuth = $fetch.create({
            baseURL: nuxtApp.$config.public.apiBase,
            headers: GetDefaultHeaders(undefined),
        });

        return {
            provide: {
                apiFetch,
                apiFetchWithoutAuth,
            },
        };
    },
});
