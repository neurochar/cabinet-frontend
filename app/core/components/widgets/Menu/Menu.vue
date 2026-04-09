<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui';
    import { RoleByID } from '~/core/domain/model/const/roles';
    import { getMenu as crmGetMenu } from '~/modules/crm/sysHooks/getMenu';
    import { getMenu as testingGetMenu } from '~/modules/testing/sysHooks/getMenu';
    import type { IAppData } from '~/plugins/app/model/types/types';
    import { menuItemsToNav } from './model/lib/menuItemsToNav';

    const appData = useState<IAppData>('app');

    const items = computed<NavigationMenuItem[][]>(() => {
        const userRole = RoleByID(useNuxtApp().$authData.userData?.account.roleId || '0');

        const menu: NavigationMenuItem[][] = [
            [
                {
                    label: 'Меню',
                    type: 'label',
                },
                {
                    label: 'Пространство',
                    icon: 'i-lucide-monitor-cog',
                    active: 'workspace' === appData.value.menuSel,
                    defaultOpen: true,
                    children: [
                        userRole && userRole.rank <= 2
                            ? {
                                  label: 'Настройки',
                                  to: '/settings',
                                  active: 'settings' === appData.value.subMenuSel,
                              }
                            : undefined,
                        {
                            label: 'Личный кабинет',
                            to: '/cabinet',
                            active: 'cabinet' === appData.value.subMenuSel,
                        },
                        {
                            label: 'Пользователи',
                            to: '/users',
                            active: 'users' === appData.value.subMenuSel,
                        },
                    ].filter((i) => i) as NavigationMenuItem[],
                },
            ],
        ];

        //if (useNuxtApp().$authData.userData!.account.role?.rights?.accessToGlobalSettings.value) {

        //}

        menu.push(menuItemsToNav(crmGetMenu(), appData.value.menuSel, appData.value.subMenuSel));
        menu.push(menuItemsToNav(testingGetMenu(), appData.value.menuSel, appData.value.subMenuSel));

        return menu;
    });
</script>

<template>
    <div>
        <UNavigationMenu
            orientation="vertical"
            :items="items"
        />
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .parent {
        > a {
            width: 100%;
        }
    }

    .kids {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        > div {
            > a {
                text-decoration: underline;
            }

            &.active {
                > a {
                    font-weight: bold;
                }
            }
        }
    }
</style>
