import { V1RoomStatus, V1TestingRoomResultAnalyzeHiringDecision } from '~/api/generated/Api';

export const IRoomStatusConfig: Record<V1RoomStatus, { label: string }> = {
    [V1RoomStatus.ROOM_STATUS_UNSPECIFIED]: { label: 'Неизвестно' },
    [V1RoomStatus.ROOM_STATUS_NOT_STARTED]: { label: 'Тестирование не завершено' },
    [V1RoomStatus.ROOM_STATUS_FINISHED]: { label: 'Тестирование завершено' },
};

export interface IRoomItemState {
    candidateID: string | null;
    profileID: string | null;
}

export const hiringDecisioToText = (value: V1TestingRoomResultAnalyzeHiringDecision) => {
    switch (value) {
        case V1TestingRoomResultAnalyzeHiringDecision.TESTING_ROOM_RESULT_ANALYZE_HIRING_DECISION_UNSPECIFIED:
            return '';
        case V1TestingRoomResultAnalyzeHiringDecision.TESTING_ROOM_RESULT_ANALYZE_HIRING_DECISION_HIRE:
            return 'Найм рекомендован';
        case V1TestingRoomResultAnalyzeHiringDecision.TESTING_ROOM_RESULT_ANALYZE_HIRING_DECISION_HIRE_WITH_CONDITIONS:
            return 'Найм рекомендован с условиями';
        case V1TestingRoomResultAnalyzeHiringDecision.TESTING_ROOM_RESULT_ANALYZE_HIRING_DECISION_DONT_HIRE:
            return 'Найм не рекомендован';
    }
};
