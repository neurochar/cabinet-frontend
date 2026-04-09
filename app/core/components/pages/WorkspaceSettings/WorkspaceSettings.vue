<script setup lang="ts">
    import { RoleByID } from '~/core/domain/model/const/roles';
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';

    useSeoMeta({
        title: 'Настройки пространства',
    });

    setMenu('workspace', 'settings');

    setAppBreadcrumbs([
        {
            name: 'Настройки пространства',
            icon: 'i-lucide-monitor-cog',
        },
    ]);

    const userRole = RoleByID(useNuxtApp().$authData.userData?.account.roleId || '0');
</script>

<template>
    <div>
        <template v-if="userRole && userRole.rank <= 2">
            <FeatureWorkspaceSettings />
        </template>
        <template v-else>
            <WidgetError :code="403" />
        </template>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
