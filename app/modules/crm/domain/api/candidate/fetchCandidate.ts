import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { ICandidateItem } from '../../model/types/candidate';

export const fetchCandidate = async (id: string, controller?: AbortController) => {
    try {
        const abortController = controller ?? new AbortController();

        return await useNuxtApp().$apiFetch<ICandidateItem>(`v1/crm/candidates/${id}`, {
            signal: abortController.signal,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
