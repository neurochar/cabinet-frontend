export async function checkPageRight(key: string): Promise<boolean> {
    const { $authData } = useNuxtApp();
    if (!$authData.isAuth || !$authData.userData) {
        await navigateTo('/');
        return false;
    }

    if (!$authData.userData.account.role?.rights?.[key]) {
        await navigateTo('/');
        return false;
    } else {
        if ($authData.userData.account.role.rights[key].value < 1) {
            await navigateTo('/');
            return false;
        }
    }

    return true;
}
