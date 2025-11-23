<script setup lang="ts">
    import type { CrmWidgetCandidateForm } from '#components';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { fetchCandidate } from '~/modules/crm/domain/api/candidate/fetchCandidate';
    import { updateCandidate } from '~/modules/crm/domain/api/candidate/updateCandidate';
    import { checkCandidateState } from '~/modules/crm/domain/hooks/checkCandidateState';
    import type { ICandidateItem, ICandidateItemState } from '~/modules/crm/domain/model/types/candidate';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    const props = defineProps<{
        id: string;
    }>();

    useSeoMeta({
        title: 'Редактирование объекта',
    });

    setMenu(module.urlName, 'candidates');

    setModuleBreadcrums([
        {
            name: 'Оборудование',
            to: `/candidates`,
        },
        {
            name: 'Редактирование объекта',
        },
    ]);

    const form = ref<InstanceType<typeof CrmWidgetCandidateForm> | null>(null);

    const itemState = ref<ICandidateItemState | null>(null);
    const itemObject = ref<ICandidateItem | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const isLoadingAnything = computed(() => isLoading.value);

    const fetchItem = async (): Promise<ICandidateItem | null> => {
        isLoading.value = true;
        try {
            const data = await fetchCandidate(props.id);
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

    const updateItemState = (item: ICandidateItem) => {
        itemObject.value = item;

        const stateValue: ICandidateItemState = {
            candidateName: item.candidateName,
            candidateSurname: item.candidateSurname,
        };

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

        errors.value = checkCandidateState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await updateCandidate(itemObject.value.id, {
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
</script>

<template>
    <div>
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
            <div class="title">Карточка кандидата</div>
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
            <CrmWidgetCandidateForm
                v-if="itemState && itemObject"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                mode="edit"
                :disabled="isLoadingAnything"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
