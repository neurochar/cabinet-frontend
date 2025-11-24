export enum ICandidateItemGender {
    'unknown' = 0,
    'male' = 1,
    'female' = 2,
}

export const ICandidateItemGenderConfig: Record<ICandidateItemGender, { label: string }> = {
    [ICandidateItemGender.unknown]: { label: 'Неизвестно' },
    [ICandidateItemGender.male]: { label: 'Мужской' },
    [ICandidateItemGender.female]: { label: 'Женский' },
};

export interface ICandidateItem {
    _version?: number;

    id: string;
    tenantID: string;
    candidateName: string;
    candidateSurname: string;
    candidateGender: ICandidateItemGender;
    candidateBirthday: string | null;
}

export type ICandidateListItem = ICandidateItem;

export interface ICandidateItemState {
    candidateName: string;
    candidateSurname: string;
    candidateGender: number;
    candidateBirthday: string | null;
}
