import { tryToCatchApiErrors } from '~/shared/errors/errors';

export async function deleteRoom(id: string) {
    try {
        return await useNuxtApp().$apiFetch<Response>(`v1/testing/rooms/${id}`, {
            method: 'DELETE',
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
