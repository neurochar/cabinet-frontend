<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import type { V1TestingListProfile } from '~/api/generated/Api';
    import Confirm from '~/core/components/shared/Confirm/modals/Confirm.vue';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Список профилей',
    });

    setMenu(module.urlName, 'profiles');

    setModuleBreadcrums([
        {
            name: 'Список профилей',
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

    const list = ref<V1TestingListProfile[]>([]);

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

    const searchInput = ref<any>(null);
    const queryFilter = ref(String(route.query.query || ''));

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const res = await api.v1.testingPublicServiceListProfiles({
                limit: String(limit.value < 1 ? 1 : limit.value),
                offset: String((page.value - 1) * limit.value),
                searchQuery: queryFilter.value || undefined,
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

    const debouncedQueryFilterFetch = useDebounceFn(async () => {
        page.value = 1;
        await fetchData();
        await nextTick();
        searchInput.value?.inputRef.focus();
    }, 500);

    watch(queryFilter, async () => {
        debouncedQueryFilterFetch();
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
                const res = await api.v1.testingPublicServiceDeleteProfile(id);
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

    const columns: TableColumn<V1TestingListProfile>[] = [
        {
            id: 'id',
            header: 'ID',
        },
        {
            id: 'name',
            header: 'Название',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: V1TestingListProfile): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Редактировать',
                    icon: 'i-lucide-edit',
                    to: `/${module.urlName}/profiles/${item.id}`,
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
</script>

<template>
    <div>
        <div class="flex justify-end">
            <UButton :to="`/${module.urlName}/profiles/new`">Создать новый объект</UButton>
        </div>
        <div
            class="mt-6 flex gap-4 items-center flex-wrap p-2"
            style="background-color: var(--ui-color-neutral-100); padding: 10px 15px; border-radius: 6px"
        >
            <div>
                <UInput
                    ref="searchInput"
                    v-model="queryFilter"
                    :disabled="isLoading"
                    placeholder="Поиск..."
                    color="neutral"
                >
                    <template
                        v-if="queryFilter?.length"
                        #trailing
                    >
                        <UButton
                            color="neutral"
                            variant="link"
                            size="sm"
                            icon="i-lucide-circle-x"
                            aria-label="Clear input"
                            @click="queryFilter = ''"
                        />
                    </template>
                </UInput>
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
                <div style="font-size: 10px; text-decoration: underline">
                    <NuxtLink :to="`/${module.urlName}/profiles/${row.original.id}`">{{ row.original.id }}</NuxtLink>
                </div>
            </template>
            <template #name-cell="{ row }">
                <b>{{ row.original.name }}</b>
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
