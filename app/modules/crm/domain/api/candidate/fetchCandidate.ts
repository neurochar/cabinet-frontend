import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { ICandidateItem } from '../../model/types/candidate';

export const fetchCandidate = async (id: string) => {
    try {
        return await useNuxtApp().$apiFetch<ICandidateItem>(`v1/crm/candidates/${id}`);
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
