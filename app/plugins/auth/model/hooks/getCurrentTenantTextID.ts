export function getCurrentTenantTextID(): string {
    const configTenant = useNuxtApp().$config.public.tenant;
    if (configTenant) {
        return configTenant;
    }

    return 'demo';
}
