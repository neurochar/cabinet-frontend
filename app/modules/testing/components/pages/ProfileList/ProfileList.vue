<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import Confirm from '~/core/components/shared/Confirm/modals/Confirm.vue';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { deleteProfile } from '~/modules/testing/domain/api/profile/deleteProfile';
    import { fetchProfileList } from '~/modules/testing/domain/api/profile/fetchProfileList';
    import type { IProfileListItem } from '~/modules/testing/domain/model/types/profile';
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

    const isLoading = ref(true);

    const list = ref<IProfileListItem[]>([]);

    const listPrepared = computed(() => {
        return list.value;
    });

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const data = await fetchProfileList();
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
                await deleteProfile(id);

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

    const columns: TableColumn<IProfileListItem>[] = [
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

    function getDropdownActions(item: IProfileListItem): DropdownMenuItem[][] {
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
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
