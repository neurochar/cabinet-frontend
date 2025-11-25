export enum IProfileItemPersonalityTraitMapPriority {
    'none' = 0,
    'low' = 1,
    'middle' = 2,
    'high' = 3,
}

interface IProfileItemPersonalityTraitMapPriorityConfigItem {
    label: string;
}

export const IProfileItemPersonalityTraitMapPriorityConfig: Record<IProfileItemPersonalityTraitMapPriority, IProfileItemPersonalityTraitMapPriorityConfigItem> =
    {
        [IProfileItemPersonalityTraitMapPriority.none]: { label: 'Не имеет значения' },
        [IProfileItemPersonalityTraitMapPriority.low]: { label: 'Низкий' },
        [IProfileItemPersonalityTraitMapPriority.middle]: { label: 'Средний' },
        [IProfileItemPersonalityTraitMapPriority.high]: { label: 'Высокий' },
    };

export const priorityToConfig = (priority: number): IProfileItemPersonalityTraitMapPriorityConfigItem | undefined => {
    return IProfileItemPersonalityTraitMapPriorityConfig[Number(priority) as IProfileItemPersonalityTraitMapPriority];
};

export interface IProfileItem {
    _version?: number;

    id: string;
    tenantID: string;
    name: string;
    personalityTraitsMap: Record<
        string,
        {
            priority: number;
            target: number;
        }
    >;
}

export type IProfileListItem = Omit<IProfileItem, 'personalityTraitsMap'>;

export interface IProfileItemState {
    name: string;
    personalityTraitsMap: Record<
        string,
        {
            priority: number;
            target: number;
        }
    >;
}
