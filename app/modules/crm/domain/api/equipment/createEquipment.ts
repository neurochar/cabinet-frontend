import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IEquipmentItem, IEquipmentItemState } from '../../model/types/equipment';

type Input = IEquipmentItemState;

type Payload = Input;

const mapDataToRequest = (data: Input): Payload => {
    return data;
};

export async function createEquipment(input: Input) {
    try {
        return await useNuxtApp().$apiFetch<IEquipmentItem>(`calculator/equipment`, {
            method: 'POST',
            body: mapDataToRequest(input),
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
