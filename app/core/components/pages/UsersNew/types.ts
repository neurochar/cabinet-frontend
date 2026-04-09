import type { V1AccountTenantPhotoFiles } from '~/api/generated/Api';

export type FormState = {
    email: string;
    roleID: string;
    password: string;
    profileName: string;
    profileSurname: string;
    profilePhotos?: V1AccountTenantPhotoFiles;
};
