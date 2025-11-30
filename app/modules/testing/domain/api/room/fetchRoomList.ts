import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IRoomListItem } from '../../model/types/room';

export const fetchRoomList = async () => {
    try {
        return await useNuxtApp().$apiFetch<{ items: IRoomListItem[] }>('v1/testing/rooms');
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
};

export const loadRoomList = () => {
    return useApiFetch<{ items: IRoomListItem[] }>('v1/testing/rooms', {
        key: () => `nocache-${Date.now()}-${Math.random()}`,
    });
};
