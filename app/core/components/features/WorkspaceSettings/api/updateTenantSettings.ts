import { OnVersionConflict } from '~/core/components/shared/VersionConflict/VersionConflict';
import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    _version: number;
    _skipVersionCheck?: boolean;
    name?: string;
}

export async function updateTenantSettings(input: Input) {
    try {
        await useNuxtApp().$apiFetch('v1/tenants', {
            method: 'PATCH',
            body: input,
        });
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            const res = await OnVersionConflict(err, () => updateTenantSettings({ ...input, _skipVersionCheck: true }));
            if (res.isConflict && !res.isCancel) {
                return;
            }
        }

        throw err;
    }
}
