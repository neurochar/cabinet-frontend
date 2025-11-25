import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IProfileListItem } from '../../model/types/profile';

export const fetchProfileList = async () => {
    try {
        return await useNuxtApp().$apiFetch<{ items: IProfileListItem[] }>('v1/testing/profiles');
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadProfileList = () => {
    return useApiFetch<{ items: IProfileListItem[] }>('v1/testing/profiles', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
