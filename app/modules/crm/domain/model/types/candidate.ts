export interface ICandidateItem {
    _version?: number;

    id: string;
    tenantID: string;
    candidateName: string;
    candidateSurname: string;
}

export type ICandidateListItem = ICandidateItem;

export interface ICandidateItemState {
    candidateName: string;
    candidateSurname: string;
}
