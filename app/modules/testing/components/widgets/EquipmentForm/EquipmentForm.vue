<script setup lang="ts">
    import type { SharedEditorJS } from '#components';
    import type { TableColumn } from '@nuxt/ui';
    import type { UploadedFile } from '~/core/components/shared/FileUploader/model/types/types';
    import { CalculatorModule } from '~/modules/calculator/const';
    import { CALCULATOR_EQUIPMENT_IMAGE_TARGET } from '~/modules/calculator/domain/model/const/const';
    import type { IConnectionTypeListItem } from '~/modules/calculator/domain/model/types/connection_type';
    import {
        IEquipmentItemTypeConfig,
        type IEquipmentItem,
        type IEquipmentItemState,
        type IEquipmentItemStateLink,
    } from '~/modules/calculator/domain/model/types/equipment';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
        connectionTypesList: IConnectionTypeListItem[];
    }>();

    const dataModel = defineModel<IEquipmentItemState>({ required: true });

    const dataItem = defineModel<IEquipmentItem | null>('dataItem', { required: true });

    const dataImageState = ref<UploadedFile[]>([]);
    if (dataItem.value?.imageFile) {
        dataImageState.value = [
            {
                targets: {
                    [CALCULATOR_EQUIPMENT_IMAGE_TARGET]: dataItem.value.imageFile,
                },
            },
        ];
    }

    watch(dataImageState, (files) => {
        if (files.length === 0) {
            dataModel.value.imageFileID = null;
            if (dataItem.value) {
                dataItem.value.imageFile = null;
            }
            return;
        }

        const file = files[0]!;
        dataModel.value.imageFileID = file.targets[CALCULATOR_EQUIPMENT_IMAGE_TARGET]!.id;
        if (dataItem.value) {
            dataItem.value.imageFile = file.targets[CALCULATOR_EQUIPMENT_IMAGE_TARGET]!;
        }
    });

    const textContentEditor = ref<InstanceType<typeof SharedEditorJS> | null>(null);

    const show = ref(true);

    const rebuild = async () => {
        await syncAllData();

        show.value = false;
        await nextTick();
        show.value = true;
    };

    const syncAllData = async () => {
        if (textContentEditor.value) {
            await textContentEditor.value.save();
        }
    };

    defineExpose({
        syncAllData,
        rebuild,
    });

    const typesListOptions = computed(() => {
        return Object.entries(IEquipmentItemTypeConfig).map(([key, value]) => ({
            value: Number(key),
            label: value.label,
        }));
    });

    const connectionTypesColumns: TableColumn<IConnectionTypeListItem>[] = [
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

    const getConnectionTypeParams = (id: number): { index: number; item?: IEquipmentItemStateLink } => {
        const i = dataModel.value.connectionTypeLinks.findIndex((l) => l.connectionTypeID === id);
        if (i === -1) {
            return {
                index: -1,
            };
        } else {
            return {
                index: i,
                item: dataModel.value.connectionTypeLinks[i],
            };
        }
    };

    const changeConnectionTypeExisting = (id: number, isAppend: boolean) => {
        if (isAppend && dataModel.value.connectionTypeLinks.find((l) => l.connectionTypeID === id) === undefined) {
            dataModel.value.connectionTypeLinks.push({
                connectionTypeID: id,
                price: null,
                monthPrice: null,
                installPrice: null,
            });
        } else if (!isAppend) {
            dataModel.value.connectionTypeLinks = dataModel.value.connectionTypeLinks.filter((l) => l.connectionTypeID !== id);
        }
    };

    const changeConnectionTypePrice = (id: number, value: number | null) => {
        const data = getConnectionTypeParams(id);
        if (!data.item) {
            return;
        }
        if (dataModel.value.connectionTypeLinks[data.index]) {
            dataModel.value.connectionTypeLinks[data.index]!.price = value;
        }
    };

    const changeConnectionTypeMonthPrice = (id: number, value: number | null) => {
        const data = getConnectionTypeParams(id);
        if (!data.item) {
            return;
        }
        if (dataModel.value.connectionTypeLinks[data.index]) {
            dataModel.value.connectionTypeLinks[data.index]!.monthPrice = value;
        }
    };

    const changeConnectionTypeInstallPrice = (id: number, value: number | null) => {
        const data = getConnectionTypeParams(id);
        if (!data.item) {
            return;
        }
        if (dataModel.value.connectionTypeLinks[data.index]) {
            dataModel.value.connectionTypeLinks[data.index]!.installPrice = value;
        }
    };
</script>

<template>
    <div
        v-if="show"
        class="form-table"
    >
        <div>
            <div class="title">Тип:</div>
            <div class="value">
                <template v-if="mode === 'edit'">
                    {{ IEquipmentItemTypeConfig[dataModel.type].label }}
                </template>
                <template v-else>
                    <USelect
                        v-model="dataModel.type"
                        size="xl"
                        :items="typesListOptions"
                        class="w-full"
                        :disabled="disabled"
                    />
                </template>
            </div>
        </div>
        <div>
            <div class="title">Название:</div>
            <div class="value">
                <UInput
                    v-model="dataModel.title"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                />
            </div>
        </div>
        <div>
            <div class="title">Опубликовано?</div>
            <div class="value">
                <USwitch
                    v-model="dataModel.isPublished"
                    size="xl"
                    color="success"
                    :disabled="disabled"
                />
            </div>
        </div>
        <div>
            <div class="title">
                Изображение:
                <div class="desc">Минимальное разрешение: 520x520</div>
            </div>
            <div class="value">
                <SharedFileUploader
                    v-model="dataImageState"
                    :disabled="disabled"
                    :lead-target="CALCULATOR_EQUIPMENT_IMAGE_TARGET"
                    mode="solo"
                    upload-url="calculator/image_file?destination=equipment_image"
                    accept-types="image/jpeg,image/png,image/webp,image/gif"
                />
            </div>
        </div>
        <div>
            <div class="title">
                Стоимость:
                <div class="desc">Значение "-1" - значит действие недоступно</div>
            </div>
            <div class="value">
                <UInputNumber
                    v-model="dataModel.price"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                    :min="-1"
                    :format-options="{
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }"
                />
            </div>
        </div>
        <div>
            <div class="title">
                Стоимость в месяц:
                <div class="desc">Значение "-1" - значит действие недоступно</div>
            </div>
            <div class="value">
                <UInputNumber
                    v-model="dataModel.monthPrice"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                    :min="-1"
                    :format-options="{
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }"
                />
            </div>
        </div>
        <div>
            <div class="title">
                Стоимость установки:
                <div class="desc">Значение "0" - значит установка не предполагается или бесплатна</div>
            </div>
            <div class="value">
                <UInputNumber
                    v-model="dataModel.installPrice"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                    :min="-1"
                    :format-options="{
                        style: 'decimal',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }"
                />
            </div>
        </div>
        <div class="form-table-full">
            <div :class="$style.linksBlockTitle">Описание:</div>
            <SharedEditorJS
                ref="textContentEditor"
                v-model="dataModel.description"
                :use-lists="true"
            />
        </div>
        <div class="form-table-full">
            <div :class="$style.linksBlockTitle">Интернет-подключения:</div>
            <div :class="$style.linksBlock">
                <UTable
                    :data="connectionTypesList"
                    :columns="connectionTypesColumns"
                    :ui="{ td: '__whitespace-normal' }"
                >
                    <template #id-cell="{ row }">
                        {{ row.original.id }}
                    </template>
                    <template #name-cell="{ row }">
                        <NuxtLink :to="`/${CalculatorModule.urlName}/connection_types/${row.original.id}`"
                            ><b>{{ row.original.title }}</b></NuxtLink
                        >
                    </template>
                    <template #action-cell="{ row }">
                        <div class="flex justify-end">
                            <div class="flex flex-col gap-2">
                                <div class="flex gap-2 items-center justify-end">
                                    <div>Использовать?</div>
                                    <div>
                                        <USwitch
                                            color="success"
                                            :disabled="disabled"
                                            :model-value="getConnectionTypeParams(row.original.id).item !== undefined"
                                            @update:model-value="changeConnectionTypeExisting(row.original.id, $event)"
                                        />
                                    </div>
                                </div>
                                <template v-if="getConnectionTypeParams(row.original.id).item">
                                    <div class="flex gap-2 items-center justify-end">
                                        <div>Переопределить стоимость?</div>
                                        <div>
                                            <USwitch
                                                color="success"
                                                :disabled="disabled"
                                                :model-value="getConnectionTypeParams(row.original.id).item?.price !== null"
                                                @update:model-value="changeConnectionTypePrice(row.original.id, $event ? 0 : null)"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        v-if="getConnectionTypeParams(row.original.id).item?.price !== null"
                                        class="flex gap-2 items-center justify-end"
                                    >
                                        <div>Стоимость:</div>
                                        <div>
                                            <UInputNumber
                                                v-model="getConnectionTypeParams(row.original.id).item!.price"
                                                size="xl"
                                                class="w-full"
                                                :disabled="disabled"
                                                :min="-1"
                                                :format-options="{
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div class="flex gap-2 items-center justify-end">
                                        <div>Переопределить стоимость в месяц?</div>
                                        <div>
                                            <USwitch
                                                color="success"
                                                :disabled="disabled"
                                                :model-value="getConnectionTypeParams(row.original.id).item?.monthPrice !== null"
                                                @update:model-value="changeConnectionTypeMonthPrice(row.original.id, $event ? 0 : null)"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        v-if="getConnectionTypeParams(row.original.id).item?.monthPrice !== null"
                                        class="flex gap-2 items-center justify-end"
                                    >
                                        <div>Стоимость в месяц:</div>
                                        <div>
                                            <UInputNumber
                                                v-model="getConnectionTypeParams(row.original.id).item!.monthPrice"
                                                size="xl"
                                                class="w-full"
                                                :disabled="disabled"
                                                :min="-1"
                                                :format-options="{
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }"
                                            />
                                        </div>
                                    </div>
                                    <div class="flex gap-2 items-center justify-end">
                                        <div>Переопределить стоимость установки?</div>
                                        <div>
                                            <USwitch
                                                color="success"
                                                :disabled="disabled"
                                                :model-value="getConnectionTypeParams(row.original.id).item?.installPrice !== null"
                                                @update:model-value="changeConnectionTypeInstallPrice(row.original.id, $event ? 0 : null)"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        v-if="getConnectionTypeParams(row.original.id).item?.installPrice !== null"
                                        class="flex gap-2 items-center justify-end"
                                    >
                                        <div>Стоимость установки:</div>
                                        <div>
                                            <UInputNumber
                                                v-model="getConnectionTypeParams(row.original.id).item!.installPrice"
                                                size="xl"
                                                class="w-full"
                                                :disabled="disabled"
                                                :min="-1"
                                                :format-options="{
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }"
                                            />
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </UTable>
            </div>
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .linksBlockTitle {
        font-size: 20px;
        margin-bottom: 20px;
    }
</style>
