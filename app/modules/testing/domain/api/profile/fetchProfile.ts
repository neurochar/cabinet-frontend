import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IProfileItem } from '../../model/types/profile';

export const fetchProfile = async (id: string, controller?: AbortController) => {
    try {
        const abortController = controller ?? new AbortController();

        return await useNuxtApp().$apiFetch<IProfileItem>(`v1/testing/profiles/${id}`, {
            signal: abortController.signal,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
