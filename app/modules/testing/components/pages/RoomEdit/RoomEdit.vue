<script setup lang="ts">
    /*
    import type { CalculatorWidgetEquipmentForm } from '#components';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { CalculatorModule } from '~/modules/calculator/const';
    import { setModuleBreadcrums } from '~/modules/calculator/domain/actions/setModuleBreadcrums';
    import { loadConnectionTypesList } from '~/modules/calculator/domain/api/connection_type/fetchConnectionTypesList';
    import { fetchEquipment } from '~/modules/calculator/domain/api/equipment/fetchEquipment';
    import { updateEquipment } from '~/modules/calculator/domain/api/equipment/updateEquipment';
    import { checkEquipmentState } from '~/modules/calculator/domain/hooks/checkEquipmentState';
    import type { IEquipmentItem, IEquipmentItemState } from '~/modules/calculator/domain/model/types/equipment';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    const props = defineProps<{
        id: number;
    }>();

    useSeoMeta({
        title: 'Редактирование объекта',
    });

    setMenu(CalculatorModule.urlName, 'equipment');

    setModuleBreadcrums([
        {
            name: 'Оборудование',
            to: `/equipment`,
        },
        {
            name: 'Редактирование объекта',
        },
    ]);

    const form = ref<InstanceType<typeof CalculatorWidgetEquipmentForm> | null>(null);

    const itemState = ref<IEquipmentItemState | null>(null);
    const itemObject = ref<IEquipmentItem | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: connectionTypesList } = loadConnectionTypesList();

    const isLoadingAnything = computed(() => isLoading.value || !connectionTypesList.value);

    const fetchItem = async (): Promise<IEquipmentItem | null> => {
        isLoading.value = true;
        try {
            const data = await fetchEquipment(props.id);
            return data;
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.code === 404) {
                    showError({
                        statusCode: e.code,
                        statusMessage: 'Объект не найден',
                    });
                } else {
                    showErrors(e.formHints());
                }
            }
        } finally {
            isLoading.value = false;
        }

        return null;
    };

    const updateItemState = (item: IEquipmentItem) => {
        itemObject.value = item;

        const stateValue: IEquipmentItemState = {
            type: item.type,
            isPublished: item.isPublished,
            title: item.title,
            description: item.description,
            imageFileID: item.imageFile ? item.imageFile.id : null,
            price: item.price,
            monthPrice: item.monthPrice,
            installPrice: item.installPrice,
            connectionTypeLinks: [],
        };

        if (item.connectionTypeLinks) {
            stateValue.connectionTypeLinks = item.connectionTypeLinks.map((link) => {
                return {
                    connectionTypeID: link.connectionType.id,
                    price: link.price,
                    monthPrice: link.monthPrice,
                    installPrice: link.installPrice,
                };
            });
        }

        itemState.value = stateValue;
    };

    watch(
        () => props.id,
        async () => {
            const data = await fetchItem();
            if (data) {
                updateItemState(data);
            }
            if (form.value) {
                form.value.rebuild();
            }
        },
        {
            immediate: true,
        },
    );

    const save = async () => {
        if (isLoadingAnything.value || !itemState.value || !itemObject.value) return;

        if (form.value) {
            await form.value.syncAllData();
        }

        errors.value = checkEquipmentState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await updateEquipment(itemObject.value.id, {
                ...itemState.value,
                _version: itemObject.value._version,
            });

            const data = await fetchItem();
            if (data) {
                updateItemState(data);
                if (form.value) {
                    form.value.rebuild();
                }
            }

            showSuccess();
        } catch (e) {
            if (e instanceof ApiError) {
                errors.value = e.formHints();
            }
        } finally {
            isLoading.value = false;
        }
    };
    */
</script>

<template>
    <div>
        <!--
        <div>
            <div class="form-table">
                <div>
                    <div class="title">ID:</div>
                    <div class="value">
                        {{ itemObject?.id }}
                    </div>
                </div>
            </div>
        </div>

        <div class="form_title mt-10">
            <div class="title">Объект</div>
            <div class="buttons">
                <UButton
                    :disabled="isLoadingAnything"
                    :loading="isLoadingAnything"
                    @click="save"
                >
                    Сохранить
                </UButton>
            </div>
        </div>
        <div
            v-if="errors.length"
            class="mt-4"
        >
            <UAlert
                title="Возникли ошибки!"
                icon="i-lucide-ban"
            >
                <template #description>
                    <template
                        v-for="error in errors"
                        :key="error"
                    >
                        <div>– {{ error }}</div>
                    </template>
                </template>
            </UAlert>
        </div>
        <div class="mt-4">
            <CalculatorWidgetEquipmentForm
                v-if="itemState && itemObject && connectionTypesList"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                :connection-types-list="connectionTypesList.items"
                mode="edit"
                :disabled="isLoadingAnything"
            />
        </div>
        -->
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
