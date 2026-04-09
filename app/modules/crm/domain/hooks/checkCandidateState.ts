import type { CandidateFromState } from '../model/types/candidate';

export function checkCandidateState(data: CandidateFromState): string[] {
    const result: string[] = [];

    if (!data.name) {
        result.push('Имя кандидата не указано');
    }

    if (!data.surname) {
        result.push('Фамилия кандидата не указана');
    }

    return result;
}
