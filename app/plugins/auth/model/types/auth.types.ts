import type { V1AccountTenant, V1Tenant } from '~/api/generated/Api';

export interface IAuthUserData {
    account: V1AccountTenant;
    tenant: V1Tenant;
}

export interface IAuthTokens {
    accessJWT: string;
}

export interface IAuthData {
    isLoading: boolean;
    isAuth: boolean;
    userData: IAuthUserData | null;
}
