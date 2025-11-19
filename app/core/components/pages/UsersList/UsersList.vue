<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import { fetchAccountsList } from '~/core/domain/api/fetchAccountsList';
    import { RoleByID } from '~/core/domain/model/const/roles';
    import type { IUserAccount } from '~/core/domain/model/types/users';
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';
    import { showErrors } from '../../shared/inform/toast';

    useSeoMeta({
        title: 'Список пользователей',
    });

    setMenu('workspace', 'users');

    setAppBreadcrumbs([
        {
            name: 'Список пользователей',
            icon: 'i-lucide-users-round',
        },
    ]);

    const route = useRoute();

    let routePage = Number(route.query.page);
    if (!routePage || isNaN(routePage)) {
        routePage = 1;
    }

    const page = ref(routePage);

    const isLoading = ref(true);

    const list = ref<IUserAccount[]>([]);

    const defaultLimit = 20;

    let routeLimit = Number(route.query.limit);
    if (!routeLimit || isNaN(routeLimit)) {
        routeLimit = defaultLimit;
    }

    const limit = ref(routeLimit);

    const total = ref(0);

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const data = await fetchAccountsList(page.value, limit.value < 1 ? 1 : limit.value);
            if (data.items) {
                list.value = data.items;
                total.value = data.total;

                await navigateTo(
                    {
                        query: {
                            ...route.query,
                            page: page.value > 1 ? page.value : undefined,
                            limit: limit.value !== defaultLimit ? limit.value : undefined,
                        },
                    },
                    { replace: true },
                );
            }
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                showErrors(e.formHints());
            }
        } finally {
            isLoading.value = false;
        }
    };

    const onPageUpdate = (p: number) => {
        if (isLoading.value) return;
        page.value = p;
        fetchData();
    };

    watch(limit, () => {
        page.value = 1;
        setTimeout(() => {
            fetchData();
        }, 100);
    });

    const columns: TableColumn<IUserAccount>[] = [
        {
            id: 'account',
            header: 'Аккаунт',
        },
        {
            id: 'profile',
            header: 'Профиль',
        },
        {
            id: 'info',
            header: 'Инфо',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: IUserAccount): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Редактировать',
                    icon: 'i-lucide-edit',
                    to: `/users/${item.id}`,
                },
            ],
        ];
    }

    const columnPinning = ref({ left: [], right: ['action'] });

    onMounted(() => {
        fetchData();
    });
</script>

<template>
    <div>
        <div class="flex justify-end">
            <UButton :to="`/users/new`">Создать пользователя</UButton>
        </div>
        <UTable
            v-model:column-pinning="columnPinning"
            :data="list"
            :columns="columns"
            :loading="isLoading"
            :ui="{ td: '__whitespace-normal' }"
        >
            <template #account-cell="{ row }">
                <div style="font-size: 10px">{{ row.original.id }}</div>
                <div>
                    <b>{{ row.original.email }}</b>
                </div>
                <div style="font-size: 11px">
                    <template v-if="!row.original.isConfirmed">
                        <span class="text-red-500">не подтвержден</span>
                    </template>
                    <template v-else>подтвержден</template>
                </div>
            </template>
            <template #profile-cell="{ row }">
                <div class="flex gap-4 items-center">
                    <div>
                        <UAvatar
                            :alt="`${row.original.profileName} ${row.original.profileSurname}`"
                            :src="row.original.profilePhoto100x100File ? row.original.profilePhoto100x100File.url : undefined"
                            size="xl"
                        />
                    </div>
                    <div>
                        <b>{{ row.original.profileName }} {{ row.original.profileSurname }}</b>
                    </div>
                </div>
            </template>
            <template #info-cell="{ row }">
                <div>
                    <div>
                        <span class="text-graylight-600">Роль:</span> <b>{{ RoleByID(row.original.roleID)?.name }}</b>
                    </div>
                    <div>
                        <span class="text-graylight-600">Статус:</span>
                        <template v-if="row.original.isBlocked">
                            <span class="text-red-500"> заблокирован </span>
                        </template>
                        <template v-else> не заблокирован </template>
                    </div>
                    <div>
                        <span class="text-graylight-600">Последняя активность:</span>
                        {{ row.original.lastRequestAt ? new Date(row.original.lastRequestAt).toLocaleString() : '-' }}
                    </div>
                </div>
            </template>
            <template #action-cell="{ row }">
                <div class="flex justify-end">
                    <UDropdownMenu :items="getDropdownActions(row.original)">
                        <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                            aria-label="Действия"
                        />
                    </UDropdownMenu>
                </div>
            </template>
        </UTable>
        <SharedPaginator
            v-model="limit"
            :disabled="isLoading"
        >
            <UPagination
                :page="page"
                :items-per-page="limit"
                :total="total"
                @update:page="onPageUpdate"
            />
        </SharedPaginator>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
