import type { IFile } from '~/shared/types/files';

export interface FormState {
    email: string;
    roleID: number;
    password: string;

    profileName: '';
    profileSurname: '';
    profilePhotoOriginalFile: null | IFile;
    profilePhoto100x100File: null | IFile;
}
