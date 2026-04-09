import type { IFile } from '~/shared/types/files';

export interface IUserAccount {
    _version: number;
    id: string;
    tenantID: string;
    roleID: number;
    email: string;
    isBlocked: boolean;
    isConfirmed: boolean;
    isEmailVerified: boolean;
    lastLoginAt: string;
    lastRequestAt: string | null;
    profileName: string;
    profileSurname: string;
    profilePhoto100x100File: null | IFile;
    profilePhotoOriginalFile: null | IFile;
}

export interface IUserRole {
    id: string;
    rank: number;
    name: string;
}
