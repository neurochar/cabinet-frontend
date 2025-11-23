export function getCurrentTenantTextID(): string | undefined {
    const configTenant = useNuxtApp().$config.public.tenant;
    if (configTenant) {
        return configTenant;
    }

    if (!import.meta.client) {
        return undefined;
    }

    const host = window.location.host;

    const hostname = host.split(':')[0] || '';
    const parts = hostname.split('.');

    if (parts.length < 3) {
        return undefined;
    }

    const subdomain = parts[parts.length - 3];

    return subdomain;
}
