import type { ICandidateItemState } from '../model/types/candidate';

export function checkCandidateState(data: ICandidateItemState): string[] {
    const result: string[] = [];

    if (!data.candidateName) {
        result.push('Имя кандидата не указано');
    }

    if (!data.candidateSurname) {
        result.push('Фамилия кандидата не указана');
    }

    return result;
}
