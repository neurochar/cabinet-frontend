import { tryToCatchApiErrors } from '~/shared/errors/errors';

export async function deleteEquipment(id: number) {
    try {
        return await useNuxtApp().$apiFetch<Response>(`calculator/equipment/${id}`, {
            method: 'DELETE',
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
