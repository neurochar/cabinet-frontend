import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IPersonalityTraitItem } from '../../model/types/personality_trait';

export const fetchPersonalityTraitsList = async () => {
    try {
        return await useNuxtApp().$apiFetch<{ items: IPersonalityTraitItem[] }>('v1/testing/personality_traits');
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadPersonalityTraitsList = () => {
    return useApiFetch<{ items: IPersonalityTraitItem[] }>('v1/testing/personality_traits', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
