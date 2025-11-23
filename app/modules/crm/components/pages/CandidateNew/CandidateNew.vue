<script setup lang="ts">
    import type { CrmWidgetCandidateForm } from '#components';
    import { showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { createCandidate } from '~/modules/crm/domain/api/candidate/createCandidate';
    import { checkCandidateState } from '~/modules/crm/domain/hooks/checkCandidateState';
    import type { ICandidateItemState } from '~/modules/crm/domain/model/types/candidate';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Создание объекта',
    });

    setMenu(module.urlName, 'candidates');

    setModuleBreadcrums([
        {
            name: 'База кандидатов',
            to: `/candidates`,
        },
        {
            name: 'Создание объекта',
        },
    ]);

    const form = ref<InstanceType<typeof CrmWidgetCandidateForm> | null>(null);

    const initState: ICandidateItemState = {
        candidateName: '',
        candidateSurname: '',
    };

    const itemObject = ref<null>(null);

    const itemState = ref<ICandidateItemState>(initState);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const isLoadingAnything = computed(() => isLoading.value);

    const save = async () => {
        if (isLoadingAnything.value || !itemState.value) return;

        if (form.value) {
            await form.value.syncAllData();
        }

        errors.value = checkCandidateState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const data = await createCandidate(itemState.value);

            showSuccess();

            await navigateTo(`/${module.urlName}/candidates/${data.id}`);
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
        <div class="form_title">
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
                v-if="itemState"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                mode="new"
                :disabled="isLoadingAnything"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
