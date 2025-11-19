import type { IEquipmentItemState } from '../model/types/equipment';

export function checkEquipmentState(data: IEquipmentItemState): string[] {
    const result: string[] = [];

    if (!data.title) {
        result.push('Название не указано');
    }

    return result;
}
