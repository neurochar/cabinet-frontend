import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IProfileItem, IProfileItemState } from '../../model/types/profile';

type Input = IProfileItemState;

type Payload = Input;

const mapDataToRequest = (data: Input): Payload => {
    return data;
};

export async function createProfile(input: Input) {
    try {
        return await useNuxtApp().$apiFetch<IProfileItem>(`v1/testing/profiles`, {
            method: 'POST',
            body: mapDataToRequest(input),
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
