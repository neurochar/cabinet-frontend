export const checkTenantIsExists = async (tenantTextID: string): Promise<boolean> => {
    const api = useApi();

    const res = await api.v1.tenantPublicServiceIsExists(tenantTextID, { fetch: useNuxtApp().$apiFetchWithoutAuth });

    return res.error === null;
};
