<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import { V1ListRoomsSort, V1RoomStatus, type V1TestingListRoom } from '~/api/generated/Api';
    import Confirm from '~/core/components/shared/Confirm/modals/Confirm.vue';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Список комнат тестирования',
    });

    setMenu(module.urlName, 'rooms');

    setModuleBreadcrums([
        {
            name: 'Список комнат тестирования',
        },
    ]);

    const api = useApi();

    const route = useRoute();

    let routePage = Number(route.query.page);
    if (!routePage || isNaN(routePage)) {
        routePage = 1;
    }

    const page = ref(routePage);

    const isLoading = ref(true);

    const list = ref<V1TestingListRoom[]>([]);

    const defaultLimit = 20;

    let routeLimit = Number(route.query.limit);
    if (!routeLimit || isNaN(routeLimit)) {
        routeLimit = defaultLimit;
    }

    const limit = ref(routeLimit);

    const total = ref(0);

    const listPrepared = computed(() => {
        return list.value;
    });

    const filterProfileID = ref<string | null>(route.query.filterProfileID ? String(route.query.filterProfileID) : null);

    const filterCandidateID = ref<string | null>(route.query.filterCandidateID ? String(route.query.filterCandidateID) : null);

    const sortValue = ref<V1ListRoomsSort>(V1ListRoomsSort.LIST_ROOM_SORT_UNSPECIFIED);
    if (Object.values(V1ListRoomsSort).includes(route.query.sort as V1ListRoomsSort)) {
        sortValue.value = route.query.sort as V1ListRoomsSort;
    }

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const res = await api.v1.testingPublicServiceListRooms({
                limit: String(limit.value < 1 ? 1 : limit.value),
                offset: String((page.value - 1) * limit.value),
                filterProfileId: filterProfileID.value || undefined,
                filterCandidateId: filterCandidateID.value || undefined,
                sort: sortValue.value !== V1ListRoomsSort.LIST_ROOM_SORT_UNSPECIFIED ? sortValue.value : undefined,
            });

            if (res.error !== null) {
                throw res.error;
            }

            if (res.data && res.data.items) {
                list.value = res.data.items;
                total.value = res.data.total;

                await navigateTo(
                    {
                        query: {
                            ...route.query,
                            page: page.value > 1 ? page.value : undefined,
                            limit: limit.value !== defaultLimit ? limit.value.toString() : undefined,
                            filterProfileID: filterProfileID.value || undefined,
                            filterCandidateID: filterCandidateID.value || undefined,
                            sort: sortValue.value !== V1ListRoomsSort.LIST_ROOM_SORT_UNSPECIFIED ? sortValue.value : undefined,
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

    watch(filterProfileID, () => {
        page.value = 1;
        setTimeout(() => {
            fetchData();
        }, 100);
    });

    watch(filterCandidateID, () => {
        page.value = 1;
        setTimeout(() => {
            fetchData();
        }, 100);
    });

    watch(sortValue, () => {
        page.value = 1;
        setTimeout(() => {
            fetchData();
        }, 100);
    });

    const removeItem = async (id: string): Promise<boolean> => {
        const modal = useOverlay().create(Confirm, {
            props: {
                text: 'Вы действительно хотите удалить объект?',
            },
            destroyOnClose: true,
        });

        const instance = modal.open();

        const shouldDelete = await instance.result;
        if (shouldDelete) {
            try {
                const res = await api.v1.testingPublicServiceDeleteRoom(id);
                if (res.error !== null) {
                    throw res.error;
                }

                showSuccess('Объект удален');

                return true;
            } catch (e) {
                if (e instanceof ApiError) {
                    showErrors(e.formHints());
                }
            }
        }

        return false;
    };

    const columns: TableColumn<V1TestingListRoom>[] = [
        {
            id: 'id',
            header: 'ID',
        },
        {
            id: 'info',
            header: 'Информация',
        },
        {
            id: 'result',
            header: 'Результат',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: V1TestingListRoom): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Просмотр',
                    icon: 'i-lucide-view',
                    to: `/${module.urlName}/rooms/${item.id}`,
                },
                {
                    label: 'Удалить',
                    icon: 'i-lucide-trash',
                    color: 'error',
                    onSelect: async () => {
                        const result = await removeItem(item.id);
                        if (result) {
                            list.value = list.value.filter((p) => p.id !== item.id);
                        }
                    },
                },
            ],
        ];
    }

    const columnPinning = ref({ left: [], right: ['action'] });

    onMounted(() => {
        fetchData();
    });

    const sortListOptions = [
        {
            value: V1ListRoomsSort.LIST_ROOM_SORT_UNSPECIFIED,
            label: 'Не указано',
        },
        {
            value: V1ListRoomsSort.LIST_ROOM_SORT_CREATED_AT,
            label: 'Время создания',
        },
        {
            value: V1ListRoomsSort.LIST_ROOM_SORT_FINISHED_AT,
            label: 'Время завершения',
        },
        {
            value: V1ListRoomsSort.LIST_ROOM_SORT_RESULT_INDEX,
            label: 'Индекс соответствия',
        },
    ];
</script>

<template>
    <div>
        <div class="flex justify-end">
            <UButton :to="`/${module.urlName}/rooms/new`">Создать новый объект</UButton>
        </div>
        <div
            class="mt-6 flex gap-4 items-center flex-wrap p-2"
            style="background-color: var(--ui-color-neutral-100); padding: 10px 15px; border-radius: 6px"
        >
            <div class="flex gap-2 items-center">
                <div style="font-size: 12px; color: var(--ui-color-graylight-500)">Сортировать по:</div>
                <div style="min-width: 170px">
                    <USelect
                        v-model="sortValue"
                        :items="sortListOptions"
                        :disabled="isLoading"
                        class="w-full"
                    />
                </div>
            </div>
            <div class="flex gap-2 items-center">
                <div style="font-size: 12px; color: var(--ui-color-graylight-500)">Фильтр по профилю:</div>
                <div>
                    <TestingSharedSelectProfile
                        v-model="filterProfileID"
                        :disabled="isLoading"
                    />
                </div>
            </div>
            <div class="flex gap-2 items-center">
                <div style="font-size: 12px; color: var(--ui-color-graylight-500)">Фильтр по кандидату:</div>
                <div>
                    <CrmSharedSelectCandidate
                        v-model="filterCandidateID"
                        :disabled="isLoading"
                    />
                </div>
            </div>
        </div>
        <UTable
            v-model:column-pinning="columnPinning"
            :data="listPrepared"
            :columns="columns"
            :loading="isLoading"
            :ui="{ td: '__whitespace-normal' }"
            class="mt-6"
        >
            <template #id-cell="{ row }">
                <div>
                    <div style="font-size: 10px; text-decoration: underline">
                        <NuxtLink :to="`/${module.urlName}/rooms/${row.original.id}`">{{ row.original.id }}</NuxtLink>
                    </div>
                    <div
                        v-if="row.original.createdAt"
                        style="color: var(--ui-color-graylight-500); margin-top: 5px; font-size: 10px"
                    >
                        Время создания: <b>{{ new Date(row.original.createdAt).toLocaleString() }}</b>
                    </div>
                </div>
            </template>
            <template #info-cell="{ row }">
                <template v-if="row.original.candidate">
                    <div>
                        Кандидат: <b>{{ row.original.candidate?.name }} {{ row.original.candidate?.surname }}</b>
                    </div>
                </template>
                <template v-if="row.original.profile">
                    <div>
                        Профиль: <b>{{ row.original.profile?.name }}</b>
                    </div>
                </template>
            </template>
            <template #result-cell="{ row }">
                <template v-if="row.original.status === V1RoomStatus.ROOM_STATUS_FINISHED">
                    <template v-if="row.original.resultIndex !== undefined">
                        <div>
                            Индекс соответствия: <b>{{ row.original.resultIndex }}</b>
                        </div>
                        <div
                            v-if="row.original.finishedAt"
                            style="color: var(--ui-color-graylight-500); margin-top: 5px; font-size: 10px"
                        >
                            Время завершения: <b>{{ new Date(row.original.finishedAt).toLocaleString() }}</b>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div style="color: var(--ui-color-graylight-500)">Тестирование не завершено</div>
                </template>
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
                :items-per-page="Number(limit)"
                :total="Number(total)"
                @update:page="onPageUpdate"
            />
        </SharedPaginator>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
