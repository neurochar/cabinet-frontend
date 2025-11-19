import { tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    currentPassword: string;
    newPassword: string;
    newPassword2: string;
}

export async function updatePassword(input: Input) {
    try {
        await useNuxtApp().$apiFetch('v1/users/my_password', {
            method: 'PUT',
            body: input,
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
