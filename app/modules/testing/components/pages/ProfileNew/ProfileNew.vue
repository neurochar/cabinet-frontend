<script setup lang="ts">
    import type { TestingWidgetProfileForm } from '#components';
    import { showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { loadPersonalityTraitsList } from '~/modules/testing/domain/api/personality_trait/fetchPersonalityTraitsList';
    import { createProfile } from '~/modules/testing/domain/api/profile/createProfile';
    import { checkProfileState } from '~/modules/testing/domain/hooks/checkProfileState';
    import type { IProfileItemState } from '~/modules/testing/domain/model/types/profile';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Создание объекта',
    });

    setMenu(module.urlName, 'profiles');

    setModuleBreadcrums([
        {
            name: 'Список профилей',
            to: `/profiles`,
        },
        {
            name: 'Создание объекта',
        },
    ]);

    const form = ref<InstanceType<typeof TestingWidgetProfileForm> | null>(null);

    const initState: IProfileItemState = {
        name: '',
        personalityTraitsMap: {},
    };

    const itemObject = ref<null>(null);

    const itemState = ref<IProfileItemState>(initState);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: personalityTraitsList } = loadPersonalityTraitsList();

    const isLoadingAnything = computed(() => isLoading.value || !personalityTraitsList.value);

    const save = async () => {
        if (isLoadingAnything.value || !itemState.value) return;

        if (form.value) {
            await form.value.syncAllData();
        }

        errors.value = checkProfileState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const data = await createProfile(itemState.value);

            showSuccess();

            await navigateTo(`/${module.urlName}/profiles/${data.id}`);
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
                v-if="itemState && personalityTraitsList"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                :personality-traits-list="personalityTraitsList.items"
                mode="new"
                :disabled="isLoadingAnything"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
