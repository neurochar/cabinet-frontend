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
    const api = useApi();

    try {
        const res = await api.v1.authTenantPublicServiceCheckAccountCode({
            code: input.code,
            id: input.id,
        });

        if (res.error !== null) {
            throw res.error;
        }

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
