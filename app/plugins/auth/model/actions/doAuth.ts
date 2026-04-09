import { AUTH_ACCESS_TOKEN_KEY } from '../const/const';
import { setAuthUserData } from './setAuthData';

export const doAuth = async (): Promise<void> => {
    const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
    if (!accessToken) {
        return;
    }

    const api = useApi();

    const result = await api.v1.authTenantPublicServiceWhoIAm();

    if (result.error != null) {
        throw result.error;
    }

    if (result.data) {
        setAuthUserData({
            account: result.data.account!,
            tenant: result.data.tenant!,
        });
    }
};
