import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IEquipmentItem } from '../../model/types/equipment';

export const fetchEquipment = async (id: number) => {
    try {
        return await useNuxtApp().$apiFetch<IEquipmentItem>(`calculator/equipment/${id}`);
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
