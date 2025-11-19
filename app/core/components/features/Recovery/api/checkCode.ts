import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    id: string;
    code: string;
}

interface Output {
    success: boolean;
    maxAttempts: number;
}

export async function checkCode(input: Input): Promise<Output> {
    try {
        await useNuxtApp().$apiFetch<Output>('v1/auth/check-code', {
            method: 'POST',
            body: {
                id: input.id,
                code: input.code,
            },
        });

        return {
            success: true,
            maxAttempts: 0,
        };
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            if (err.textCode === 'CODE_INVALID') {
                return {
                    success: false,
                    maxAttempts: Number(err.details['max_attempts'] || 0),
                };
            }
        }

        throw err;
    }
}
