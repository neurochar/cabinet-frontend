import { Api } from '~/api/generated/Api';

let api: Api<unknown> | null = null;

export const useApi = () => {
    if (!api) {
        const { $apiFetch } = useNuxtApp();
        api = new Api({ customFetch: $apiFetch });
    }
    return api;
};
