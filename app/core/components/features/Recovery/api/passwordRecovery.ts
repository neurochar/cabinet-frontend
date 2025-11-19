import { tryToCatchApiErrors } from '~/shared/errors/errors';

interface Output {
    codeID: string;
}

export async function passwordRecovery(email: string, tenantTextID: string): Promise<Output> {
    try {
        return await useNuxtApp().$apiFetch<Output>('v1/auth/password-recovery', {
            method: 'POST',
            body: {
                email,
                tenantTextID,
            },
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
