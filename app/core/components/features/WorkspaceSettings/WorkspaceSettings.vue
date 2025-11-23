<script setup lang="ts">
    import { doAuth } from '~/plugins/auth/model';
    import { ApiError } from '~/shared/errors/errors';
    import { showSuccess } from '../../shared/inform/toast';
    import { updateTenantSettings } from './api/updateTenantSettings';

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const formState = ref({ ...useNuxtApp().$authData.userData!.tenant });

    const disabled = ref(false);

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        if (formState.value.name.length < 1) {
            errors.value.push('Название не указано');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await updateTenantSettings({
                _version: formState.value._version,
                _skipVersionCheck: true,
                name: formState.value.name,
            });

            await doAuth();
            formState.value = { ...useNuxtApp().$authData.userData!.tenant };

            showSuccess();
        } catch (e) {
            if (e instanceof ApiError) {
                errors.value = e.formHints();
            } else {
                errors.value = ['Неизвестная ошибка'];
            }
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <div>
        <div class="form_title">
            <div class="title">Рабочее пространство</div>
            <div class="buttons">
                <UButton
                    :disabled="isLoading"
                    :loading="isLoading"
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
            <div class="form-table">
                <div>
                    <div class="title">
                        Название:
                        <div class="desc">
                            Пишите так, как удобно — имя или название команды. Этот идентификатор поможет пользователям понимать, в каком пространстве они
                            работают.
                        </div>
                    </div>
                    <div class="value">
                        <UInput
                            v-model="formState.name"
                            size="xl"
                            class="w-full"
                            :disabled="disabled"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
