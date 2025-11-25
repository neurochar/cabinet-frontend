import { tryToCatchApiErrors } from '~/shared/errors/errors';

export async function deleteProfile(id: string) {
    try {
        return await useNuxtApp().$apiFetch<Response>(`v1/testing/profiles/${id}`, {
            method: 'DELETE',
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
