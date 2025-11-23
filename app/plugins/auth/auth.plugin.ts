import { doAuth } from './model';
import { checkTenantIsExists } from './model/actions/checkTenantIsExists';
import { getCurrentTenantTextID } from './model/hooks/getCurrentTenantTextID';
import type { IAuthData } from './model/types/auth.types';

export default defineNuxtPlugin({
    name: 'auth',
    enforce: 'pre',
    async setup() {
        const authData = useState<IAuthData>('authData', () =>
            reactive({
                isLoading: false,
                isAuth: false,
                userData: null,
            }),
        );

        const tenantTextID = getCurrentTenantTextID();

        auth: if (import.meta.client && tenantTextID) {
            authData.value.isLoading = true;

            let loaderDiv;
            if (window) {
                loaderDiv = window.document.createElement('DIV');
                loaderDiv.id = 'pageLoader';
                loaderDiv.innerHTML = '<div>Загрузка...</div>';
                window.document.body.append(loaderDiv);
            }

            try {
                const isExists = await checkTenantIsExists(tenantTextID);
                if (!isExists) {
                    navigateTo(useNuxtApp().$config.public.mainUrl, { external: true });
                }
            } catch (e: unknown) {
                console.error(e);
                alert('Ошибка при загрузке tenantID...');
                break auth;
            }

            try {
                await doAuth();
            } catch (e: unknown) {
                //
            }

            authData.value.isLoading = false;

            if (loaderDiv) {
                loaderDiv.remove();
            }
        }

        return {
            provide: {
                authData: authData.value,
            },
        };
    },
    env: {
        islands: true,
    },
});
