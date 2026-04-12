<script setup lang="ts">
    import type { TestingWidgetProfileForm } from '#components';
    import type { V1TestingProfile } from '~/api/generated/Api';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { loadPersonalityTraitsList } from '~/modules/testing/domain/api/personality_trait/fetchPersonalityTraitsList';
    import { checkProfileState } from '~/modules/testing/domain/hooks/checkProfileState';
    import type { IProfileItemState } from '~/modules/testing/domain/model/types/profile';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    const props = defineProps<{
        id: string;
    }>();

    useSeoMeta({
        title: 'Редактирование объекта',
    });

    setMenu(module.urlName, 'profiles');

    setModuleBreadcrums([
        {
            name: 'Список профилей',
            to: `/profiles`,
        },
        {
            name: 'Редактирование объекта',
        },
    ]);

    const api = useApi();

    const form = ref<InstanceType<typeof TestingWidgetProfileForm> | null>(null);

    const itemState = ref<IProfileItemState | null>(null);
    const itemObject = ref<V1TestingProfile | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: personalityTraitsList } = loadPersonalityTraitsList();

    const isLoadingAnything = computed(() => isLoading.value || !personalityTraitsList.value);

    const fetchItem = async (): Promise<V1TestingProfile | null> => {
        isLoading.value = true;
        try {
            const res = await api.v1.testingPublicServiceGetProfile(props.id);

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

    const updateItemState = (item: V1TestingProfile) => {
        itemObject.value = item;

        const stateValue: IProfileItemState = {
            name: item.name,
            description: item.description,
            personalityTraits: {
                map: item.personalityTraits?.map || {},
            },
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

        errors.value = checkProfileState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const res = await api.v1.testingPublicServicePatchProfile(props.id, {
                payload: {
                    name: itemState.value.name,
                    description: itemState.value.description,
                    personalityTraits: {
                        map: itemState.value.personalityTraits.map,
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
            <div class="title">Профиль</div>
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
            <TestingWidgetProfileForm
                v-if="itemState && itemObject && personalityTraitsList?.items"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                :personality-traits-list="personalityTraitsList.items"
                mode="edit"
                :disabled="isLoadingAnything"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
