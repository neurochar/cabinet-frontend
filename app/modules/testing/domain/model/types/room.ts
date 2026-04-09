import { V1RoomStatus } from '~/api/generated/Api';

export const IRoomStatusConfig: Record<V1RoomStatus, { label: string }> = {
    [V1RoomStatus.ROOM_STATUS_UNSPECIFIED]: { label: 'Неизвестно' },
    [V1RoomStatus.ROOM_STATUS_NOT_STARTED]: { label: 'Тестирование не завершено' },
    [V1RoomStatus.ROOM_STATUS_FINISHED]: { label: 'Тестирование завершено' },
};

export interface IRoomItemState {
    candidateID: string | null;
    profileID: string | null;
}
