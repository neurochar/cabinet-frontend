import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { ICandidateListItem } from '../../model/types/candidate';

export const fetchCandidateList = async () => {
    try {
        return await useNuxtApp().$apiFetch<{ items: ICandidateListItem[] }>('v1/crm/candidates');
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadCandidateList = () => {
    return useApiFetch<{ items: ICandidateListItem[] }>('v1/crm/candidates', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
