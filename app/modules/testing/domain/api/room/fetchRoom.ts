import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IRoomItem } from '../../model/types/room';

export const fetchRoom = async (id: string) => {
    try {
        return await useNuxtApp().$apiFetch<IRoomItem>(`v1/testing/rooms/${id}`);
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};
