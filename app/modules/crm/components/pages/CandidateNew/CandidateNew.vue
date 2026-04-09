<script setup lang="ts">
    import type { CrmWidgetCandidateForm } from '#components';
    import { V1Gender } from '~/api/generated/Api';
    import { showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { checkCandidateState } from '~/modules/crm/domain/hooks/checkCandidateState';
    import type { CandidateFromState } from '~/modules/crm/domain/model/types/candidate';
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

    const api = useApi();

    const form = ref<InstanceType<typeof CrmWidgetCandidateForm> | null>(null);

    const itemObject = ref<null>(null);

    const itemState = ref<CandidateFromState>({
        gender: V1Gender.GENDER_UNSPECIFIED,
        name: '',
        surname: '',
    });

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
            const res = await api.v1.crmPublicServiceCreateCandidate({
                payload: {
                    gender: itemState.value.gender,
                    name: itemState.value.name,
                    surname: itemState.value.surname,
                    birthday: {
                        date: itemState.value.birthday,
                    },
                },
            });

            if (res.error !== null) {
                throw res.error;
            }

            if (res.data) {
                showSuccess();
                await navigateTo(`/${module.urlName}/candidates/${res.data.item?.id}`);
            }
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
