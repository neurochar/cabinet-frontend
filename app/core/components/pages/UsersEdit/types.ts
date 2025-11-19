import type { IFile } from '~/shared/types/files';

export interface FormState {
    profileName: string;
    profileSurname: string;
    profilePhotoOriginalFile: null | IFile;
    profilePhoto100x100File: null | IFile;
}
