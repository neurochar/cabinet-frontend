import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IEquipmentListItem } from '../../model/types/equipment';

export const fetchEquipmentList = async () => {
    try {
        return await useNuxtApp().$apiFetch<{ items: IEquipmentListItem[] }>('calculator/equipment');
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadEquipmentList = () => {
    return useApiFetch<{ items: IEquipmentListItem[] }>('calculator/equipment', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
