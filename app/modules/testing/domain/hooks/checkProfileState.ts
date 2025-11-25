import type { IProfileItemState } from '../model/types/profile';

export function checkProfileState(data: IProfileItemState): string[] {
    const result: string[] = [];

    if (!data.name) {
        result.push('Название не указано');
    }

    if (Object.entries(data.personalityTraitsMap).length === 0) {
        result.push('Черты личности не указаны');
    }

    return result;
}
