export enum IRoomStatus {
    'not_started' = 0,
    'finished' = 10,
}

interface IRoomStatusConfigItem {
    label: string;
}

export const IRoomStatusConfig: Record<IRoomStatus, IRoomStatusConfigItem> = {
    [IRoomStatus.not_started]: { label: 'Тестирование не завершено' },
    [IRoomStatus.finished]: { label: 'Тестирование завершено' },
};

export const statusToConfig = (status: number): IRoomStatusConfigItem | undefined => {
    return IRoomStatusConfig[Number(status) as IRoomStatus];
};

export interface IRoomItem {
    _version?: number;

    id: string;
    tenantID: string;
    status: IRoomStatus;
    candidate: {
        id: string;
        candidateName: string;
        candidateSurname: string;
    } | null;
    profile: {
        id: string;
        name: string;
    } | null;
    personalityTraitsMap: Record<
        string,
        {
            priority: number;
            target: number;
        }
    >;
}

export type IRoomListItem = Omit<IRoomItem, 'personalityTraitsMap'>;

export interface IRoomItemState {
    candidateID: string | null;
    profileID: string | null;
}
