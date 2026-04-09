export async function checkPageRight(key: string): Promise<boolean> {
    const { $authData } = useNuxtApp();
    if (!$authData.isAuth || !$authData.userData) {
        await navigateTo('/');
        return false;
    }

    return true;
}
