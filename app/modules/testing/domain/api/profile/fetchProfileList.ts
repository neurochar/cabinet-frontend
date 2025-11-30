import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IProfileListItem } from '../../model/types/profile';

export interface IFetchProfileListFilter {
    search?: string;
    limit?: number;
}

export const fetchProfileList = async (filter?: IFetchProfileListFilter, controller?: AbortController) => {
    try {
        const abortController = controller ?? new AbortController();

        return await useNuxtApp().$apiFetch<{ items: IProfileListItem[] }>('v1/testing/profiles', {
            signal: abortController.signal,
            params: filter,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadProfileList = () => {
    return useApiFetch<{ items: IProfileListItem[] }>('v1/testing/profiles', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
