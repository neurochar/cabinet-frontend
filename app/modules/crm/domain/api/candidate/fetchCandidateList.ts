import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { ICandidateListItem } from '../../model/types/candidate';

export interface IFetchCandidateListFilter {
    search?: string;
    limit?: number;
}

export const fetchCandidateList = async (filter?: IFetchCandidateListFilter, controller?: AbortController) => {
    try {
        const abortController = controller ?? new AbortController();

        return await useNuxtApp().$apiFetch<{ items: ICandidateListItem[] }>('v1/crm/candidates', {
            signal: abortController.signal,
            params: filter,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadCandidateList = () => {
    return useApiFetch<{ items: ICandidateListItem[] }>('v1/crm/candidates', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
