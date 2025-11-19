<script setup lang="ts">
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';

    useSeoMeta({
        title: 'Личный кабинет',
    });

    setMenu('workspace', 'cabinet');

    setAppBreadcrumbs([
        {
            name: 'Личный кабинет',
            icon: 'i-lucide-user-round-cog',
        },
    ]);
</script>

<template>
    <FeatureCabinet />
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
