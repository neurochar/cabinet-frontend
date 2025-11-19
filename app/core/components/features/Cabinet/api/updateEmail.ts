import { tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    email: string;
}

export async function updateEmail(input: Input) {
    try {
        await useNuxtApp().$apiFetch('users/accounts/me/email', {
            method: 'PUT',
            body: input,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
