<script setup lang="ts">
    import { ru } from '@nuxt/ui/locale';
    import '@valibot/i18n/ru';
    import * as v from 'valibot';
    const { $authData, $appProvider } = useNuxtApp();

    v.setGlobalConfig({ lang: 'ru' });

    useHead({
        htmlAttrs: {
            lang: 'ru',
        },
        titleTemplate: (titleChunk) => {
            const authData = useNuxtApp().$authData.userData;
            const appTitle = `${toValue($appProvider.title)}${authData ? ` | ${authData.tenant.name}` : ''}`;
            return titleChunk ? `${titleChunk} - ${appTitle}` : appTitle;
        },
    });
</script>

<template>
    <UApp
        :locale="ru"
        :toaster="{ position: 'top-center', expand: false, duration: 3000 }"
    >
        <NuxtLayout :name="$authData.isAuth ? 'auth' : 'guest'">
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
