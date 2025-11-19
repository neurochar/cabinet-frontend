<script setup lang="ts">
    import { MonitorCog } from 'lucide-vue-next';
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';

    useSeoMeta({
        title: '',
    });

    setMenu('', '');

    setAppBreadcrumbs([]);
</script>

<template>
    <div>
        <div :id="$style.title"><MonitorCog class="inline-block mr-3 stroke-neutral-500" />{{ $authData.userData?.tenant.name }}</div>
        <div :id="$style.desc">Добро пожаловать в панель управления!</div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    #title {
        font-family: 'Strong';
        font-size: 32px;

        .width-size-sm-less({
            font-size: 24px;
        });
    }

    #desc {
        margin-top: 20px;
        font-size: 16px;
    }
</style>
