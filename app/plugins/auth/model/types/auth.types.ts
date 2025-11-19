import type { ITenant } from '~/core/domain/model/types/tenant';
import type { IUserAccount } from '~/core/domain/model/types/users';

export interface IAuthUserData {
    account: IUserAccount;
    tenant: ITenant;
}

export interface IAuthTokens {
    accessJWT: string;
}

export interface IAuthData {
    isLoading: boolean;
    isAuth: boolean;
    userData: IAuthUserData | null;
}
