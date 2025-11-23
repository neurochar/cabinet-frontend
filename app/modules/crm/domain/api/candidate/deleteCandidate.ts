import { tryToCatchApiErrors } from '~/shared/errors/errors';

export async function deleteCandidate(id: string) {
    try {
        return await useNuxtApp().$apiFetch<Response>(`v1/crm/candidates/${id}`, {
            method: 'DELETE',
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
