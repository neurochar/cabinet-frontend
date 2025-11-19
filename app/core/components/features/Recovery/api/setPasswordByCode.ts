import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    id: string;
    code: string;
    password: string;
    password2: string;
}

interface Output {
    success: boolean;
    reason?: 'code' | 'password';
}

export async function setPasswordByCode(input: Input): Promise<Output> {
    try {
        await useNuxtApp().$apiFetch<Output>('v1/auth/password-by-code', {
            method: 'POST',
            body: {
                id: input.id,
                code: input.code,
                password: input.password,
                password2: input.password2,
            },
        });

        return {
            success: true,
        };
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            if (err.textCode === 'CODE_INVALID') {
                return {
                    success: false,
                    reason: 'code',
                };
            } else if (err.textCode === 'INVALID_PASSWORD') {
                return {
                    success: false,
                    reason: 'password',
                };
            }
        }

        throw err;
    }
}
