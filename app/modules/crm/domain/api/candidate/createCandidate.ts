import { tryToCatchApiErrors } from '~/shared/errors/errors';
import type { ICandidateItem, ICandidateItemState } from '../../model/types/candidate';

type Input = ICandidateItemState;

type Payload = Input;

const mapDataToRequest = (data: Input): Payload => {
    return data;
};

export async function createCandidate(input: Input) {
    try {
        return await useNuxtApp().$apiFetch<ICandidateItem>(`v1/crm/candidates`, {
            method: 'POST',
            body: mapDataToRequest(input),
        });
    } catch (e: unknown) {
        throw tryToCatchApiErrors(e);
    }
}
