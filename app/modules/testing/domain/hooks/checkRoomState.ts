import type { IRoomItemState } from '../model/types/room';

export function checkRoomState(data: IRoomItemState): string[] {
    const result: string[] = [];

    if (!data.candidateID) {
        result.push('Кандидат не выбран');
    }

    if (!data.profileID) {
        result.push('Профиль не выбран');
    }

    return result;
}
