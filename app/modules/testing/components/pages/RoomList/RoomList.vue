<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import Confirm from '~/core/components/shared/Confirm/modals/Confirm.vue';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { deleteRoom } from '~/modules/testing/domain/api/room/deleteRoom';
    import { fetchRoomList } from '~/modules/testing/domain/api/room/fetchRoomList';
    import type { IRoomListItem } from '~/modules/testing/domain/model/types/room';
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

    const isLoading = ref(true);

    const list = ref<IRoomListItem[]>([]);

    const listPrepared = computed(() => {
        return list.value;
    });

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const data = await fetchRoomList();
            if (data.items) {
                list.value = data.items;
            }
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                showErrors(e.formHints());
            }
        } finally {
            isLoading.value = false;
        }
    };

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
                await deleteRoom(id);

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

    const columns: TableColumn<IRoomListItem>[] = [
        {
            id: 'id',
            header: 'ID',
        },
        {
            id: 'info',
            header: 'Информация',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: IRoomListItem): DropdownMenuItem[][] {
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
</script>

<template>
    <div>
        <div class="flex justify-end">
            <UButton :to="`/${module.urlName}/rooms/new`">Создать новый объект</UButton>
        </div>
        <UTable
            v-model:column-pinning="columnPinning"
            :data="listPrepared"
            :columns="columns"
            :loading="isLoading"
            :ui="{ td: '__whitespace-normal' }"
        >
            <template #id-cell="{ row }">
                {{ row.original.id }}
            </template>
            <template #info-cell="{ row }">
                <template v-if="row.original.candidate">
                    <div>
                        Кандидат: <b>{{ row.original.candidate.candidateName }} {{ row.original.candidate.candidateSurname }}</b>
                    </div>
                </template>
                <template v-if="row.original.profile">
                    <div>
                        Профиль: <b>{{ row.original.profile.name }}</b>
                    </div>
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
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
