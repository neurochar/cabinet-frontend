import { OnVersionConflict } from '~/core/components/shared/VersionConflict/VersionConflict';
import { ApiError, tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IEquipmentItemState } from '../../model/types/equipment';

type Input = {
    _version?: number;
    _skipVersionCheck?: boolean;
} & IEquipmentItemState;

type Payload = Input;

const mapDataToRequest = (data: Input): Payload => {
    return data;
};

export async function updateEquipment(id: number, input: Input) {
    try {
        await useNuxtApp().$apiFetch(`calculator/equipment/${id}`, {
            method: 'PUT',
            body: mapDataToRequest(input),
        });
    } catch (e: unknown) {
        const err = tryToCatchApiErrors(e);
        if (err instanceof ApiError) {
            const res = await OnVersionConflict(err, () => updateEquipment(id, { ...input, _skipVersionCheck: true }));
            if (res.isConflict && !res.isCancel) {
                return;
            }
        }

        throw err;
    }
}
