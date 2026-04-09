<script setup lang="ts">
    import type { CrmWidgetCandidateForm } from '#components';
    import type { V1Candidate } from '~/api/generated/Api';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { checkCandidateState } from '~/modules/crm/domain/hooks/checkCandidateState';
    import type { CandidateFromState } from '~/modules/crm/domain/model/types/candidate';
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
            name: 'База кандидатов',
            to: `/candidates`,
        },
        {
            name: 'Редактирование объекта',
        },
    ]);

    const api = useApi();

    const form = ref<InstanceType<typeof CrmWidgetCandidateForm> | null>(null);

    const itemState = ref<CandidateFromState | null>(null);
    const itemObject = ref<V1Candidate | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const isLoadingAnything = computed(() => isLoading.value);

    const fetchItem = async (): Promise<V1Candidate | null> => {
        isLoading.value = true;
        try {
            const res = await api.v1.crmPublicServiceGetCandidate(props.id);

            if (res.error !== null) {
                throw res.error;
            }

            return res.data?.item || null;
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

    const updateItemState = (item: V1Candidate) => {
        itemObject.value = item;
        itemState.value = {
            name: item.name,
            surname: item.surname,
            birthday: item.birthday,
            gender: item.gender,
        };
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
            const res = await api.v1.crmPublicServicePatchCandidate(itemObject.value.id, {
                payload: {
                    gender: itemState.value.gender,
                    name: itemState.value.name,
                    surname: itemState.value.surname,
                    birthday: {
                        date: itemState.value.birthday,
                    },
                },
                version: itemObject.value.version,
                skipVersionCheck: false,
            });

            if (res.error !== null) {
                throw res.error;
            }

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
