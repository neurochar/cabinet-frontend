import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { IRoomItem, IRoomItemState } from '../../model/types/room';

type Input = IRoomItemState;

type Payload = Input;

const mapDataToRequest = (data: Input): Payload => {
    return data;
};

export async function createRoom(input: Input) {
    try {
        return await useNuxtApp().$apiFetch<IRoomItem>(`v1/testing/rooms`, {
            method: 'POST',
            body: mapDataToRequest(input),
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
