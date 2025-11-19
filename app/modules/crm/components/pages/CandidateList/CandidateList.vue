<script setup lang="ts">
    // import { CalculatorModule } from '~/modules/calculator/const';
    // import { setModuleBreadcrums } from '~/modules/calculator/domain/actions/setModuleBreadcrums';
    // import { deleteEquipment } from '~/modules/calculator/domain/api/equipment/deleteEquipment';
    // import { fetchEquipmentList } from '~/modules/calculator/domain/api/equipment/fetchEquipmentList';
    // import { IEquipmentItemTypeConfig, type IEquipmentListItem } from '~/modules/calculator/domain/model/types/equipment';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';

    useSeoMeta({
        title: 'База кандидатов',
    });

    setMenu(module.urlName, 'candidates');

    setModuleBreadcrums([
        {
            name: 'База кандидатов',
        },
    ]);

    /*

    const isLoading = ref(true);

    const list = ref<IEquipmentListItem[]>([]);

    const typeFilter = ref(0);

    const typesListOptions = computed(() => {
        return [
            {
                value: 0,
                label: 'Все типы...',
                class: 'text-graylight-600',
            },
            ...Object.entries(IEquipmentItemTypeConfig).map(([key, value]) => ({
                value: Number(key),
                label: value.label,
            })),
        ];
    });

    const listPrepared = computed(() => {
        return list.value.filter((item) => typeFilter.value === 0 || item.type === typeFilter.value);
    });

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const data = await fetchEquipmentList();
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

    const removeItem = async (id: number): Promise<boolean> => {
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
                await deleteEquipment(id);

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

    const columns: TableColumn<IEquipmentListItem>[] = [
        {
            id: 'id',
            header: 'ID',
        },
        {
            id: 'image',
            header: 'Изображение',
        },
        {
            id: 'name',
            header: 'Название',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: IEquipmentListItem): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Редактировать',
                    icon: 'i-lucide-edit',
                    to: `/${CalculatorModule.urlName}/equipment/${item.id}`,
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
    */
</script>

<template>
    <div>
        <!--
        <div class="flex justify-end">
            <UButton :to="`/${CalculatorModule.urlName}/equipment/new`">Создать новый объект</UButton>
        </div>
        <div class="mt-4 flex gap-4 items-center flex-wrap">
            <div>
                <USelect
                    v-model="typeFilter"
                    :items="typesListOptions"
                    class="w-48"
                />
            </div>
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
            <template #image-cell="{ row }">
                <template v-if="row.original.imageFile">
                    <img
                        :src="row.original.imageFile.url"
                        alt=""
                        style="max-width: 50px"
                    />
                </template>
                <template v-else>-</template>
            </template>
            <template #name-cell="{ row }">
                <div>{{ IEquipmentItemTypeConfig[row.original.type].label }}</div>
                <b>{{ row.original.title }}</b>
                <div>
                    <template v-if="row.original.isPublished">
                        <span class="text-green-500">опубликовано</span>
                    </template>
                    <template v-else>
                        <span class="text-red-500">не опубликовано</span>
                    </template>
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
        -->
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
