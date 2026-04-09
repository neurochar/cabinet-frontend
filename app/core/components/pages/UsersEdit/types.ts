import type { V1AccountTenantPhotoFiles } from '~/api/generated/Api';

export interface FormState {
    profileName: string;
    profileSurname: string;
    profilePhotos?: V1AccountTenantPhotoFiles;
}
