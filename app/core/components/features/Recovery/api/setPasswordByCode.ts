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
    const api = useApi();

    try {
        const res = await api.v1.authTenantPublicServiceUpdatePasswordByCode({
            id: input.id,
            code: input.code,
            password: input.password,
            password2: input.password2,
        });

        if (res.error !== null) {
            throw res.error;
        }

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
