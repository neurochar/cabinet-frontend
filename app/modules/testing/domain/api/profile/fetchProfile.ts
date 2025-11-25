import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IProfileItem } from '../../model/types/profile';

export const fetchProfile = async (id: string) => {
    try {
        return await useNuxtApp().$apiFetch<IProfileItem>(`v1/testing/profiles/${id}`);
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
