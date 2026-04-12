import { V1Gender, type V1Candidate } from '~/api/generated/Api';

export const ICandidateItemGenderConfig: Record<V1Gender, { label: string }> = {
    [V1Gender.GENDER_UNSPECIFIED]: { label: 'Неизвестно' },
    [V1Gender.GENDER_MALE]: { label: 'Мужской' },
    [V1Gender.GENDER_FEMALE]: { label: 'Женский' },
};

export type CandidateFromState = Pick<V1Candidate, 'name' | 'surname' | 'birthday' | 'gender' | 'resumeFile'>;
