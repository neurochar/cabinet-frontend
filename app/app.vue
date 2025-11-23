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
        link: [
            // --- Стандартные favicon ---
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
            { rel: 'icon', type: 'image/png', sizes: '60x60', href: '/favicon-60x60.png' },
            { rel: 'icon', type: 'image/png', sizes: '72x72', href: '/favicon-72x72.png' },
            { rel: 'icon', type: 'image/png', sizes: '76x76', href: '/favicon-76x76.png' },
            { rel: 'icon', type: 'image/png', sizes: '57x57', href: '/favicon-57x57.png' },
            { rel: 'icon', type: 'image/png', sizes: '70x70', href: '/favicon-70x70.png' },

            // --- Apple Touch Icon ---
            { rel: 'apple-touch-icon', sizes: '114x114', href: '/favicon-114x114.png' },
            { rel: 'apple-touch-icon', sizes: '120x120', href: '/favicon-120x120.png' },
            { rel: 'apple-touch-icon', sizes: '128x128', href: '/favicon-128x128.png' },
            { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicon-144x144.png' },
            { rel: 'apple-touch-icon', sizes: '150x150', href: '/favicon-150x150.png' },
            { rel: 'apple-touch-icon', sizes: '152x152', href: '/favicon-152x152.png' },
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-180x180.png' },

            // --- PWA ---
            { rel: 'manifest', href: '/manifest.json' },

            // --- MS Tiles ---
            { rel: 'msapplication-config', href: '/browserconfig.xml' },
            { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png' },
            { rel: 'icon', type: 'image/png', sizes: '310x310', href: '/favicon-310x310.png' },
            { rel: 'icon', type: 'image/png', sizes: '384x384', href: '/favicon-384x384.png' },
            { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon-512x512.png' },
        ],
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
