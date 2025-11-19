<script setup lang="ts">
    /*
    import type { CalculatorWidgetEquipmentForm } from '#components';
    import { showSuccess } from '~/core/components/shared/inform/toast';
    import { CalculatorModule } from '~/modules/calculator/const';
    import { setModuleBreadcrums } from '~/modules/calculator/domain/actions/setModuleBreadcrums';
    import { loadConnectionTypesList } from '~/modules/calculator/domain/api/connection_type/fetchConnectionTypesList';
    import { createEquipment } from '~/modules/calculator/domain/api/equipment/createEquipment';
    import { checkEquipmentState } from '~/modules/calculator/domain/hooks/checkEquipmentState';
    import { IEquipmentItemType, type IEquipmentItemState } from '~/modules/calculator/domain/model/types/equipment';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Создание объекта',
    });

    setMenu(CalculatorModule.urlName, 'equipment');

    setModuleBreadcrums([
        {
            name: 'Оборудование',
            to: `/equipment`,
        },
        {
            name: 'Создание объекта',
        },
    ]);

    const form = ref<InstanceType<typeof CalculatorWidgetEquipmentForm> | null>(null);

    const initState: IEquipmentItemState = {
        type: IEquipmentItemType.internet_pon,
        isPublished: true,
        title: '',
        description: {},
        imageFileID: null,
        price: 0,
        monthPrice: 0,
        installPrice: 0,
        connectionTypeLinks: [],
    };

    const itemObject = ref<null>(null);

    const itemState = ref<IEquipmentItemState>(initState);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: connectionTypesList } = loadConnectionTypesList();

    const isLoadingAnything = computed(() => isLoading.value || !connectionTypesList.value);

    const save = async () => {
        if (isLoadingAnything.value || !itemState.value) return;

        if (form.value) {
            await form.value.syncAllData();
        }

        errors.value = checkEquipmentState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const data = await createEquipment(itemState.value);

            showSuccess();

            await navigateTo(`/${CalculatorModule.urlName}/equipment/${data.id}`);
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
        <div class="form_title">
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
                v-if="itemState && connectionTypesList"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                :connection-types-list="connectionTypesList.items"
                mode="new"
                :disabled="isLoadingAnything"
            />
        </div>
        -->
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
