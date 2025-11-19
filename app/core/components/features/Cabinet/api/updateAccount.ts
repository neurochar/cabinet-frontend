import { OnVersionConflict } from '~/core/components/shared/VersionConflict/VersionConflict';
import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';

interface Input {
    _version: number;
    _skipVersionCheck?: boolean;
    profileName: string;
    profileSurname: string;
    profilePhotoOriginalFileID: string | null;
    profilePhoto100x100FileID: string | null;
}

export async function updateAccount(input: Input) {
    try {
        await useNuxtApp().$apiFetch('v1/users/my_profile', {
            method: 'PUT',
            body: input,
        });
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            const res = await OnVersionConflict(err, () => updateAccount({ ...input, _skipVersionCheck: true }));
            if (res.isConflict && !res.isCancel) {
                return;
            }
        }

        throw err;
    }
}
