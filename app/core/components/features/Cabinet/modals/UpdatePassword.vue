<script setup lang="ts">
    import { ApiError } from '~/shared/errors/errors';
    import { updatePassword } from '../api/updatePassword';

    const emit = defineEmits<{ close: [boolean] }>();

    const errors = ref<string[]>([]);

    const isLoading = ref(false);

    const showPassword = ref(false);

    const formState = ref<{
        currentPassword: string;
        newPassword: string;
        newPassword2: string;
    }>({
        currentPassword: '',
        newPassword: '',
        newPassword2: '',
    });

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        if (formState.value.currentPassword.length < 1) {
            errors.value.push('Текущий пароль не указан');
        }

        if (formState.value.newPassword.length < 1) {
            errors.value.push('Новый пароль не указан');
        }

        if (formState.value.newPassword !== formState.value.newPassword2) {
            errors.value.push('Пароли не совпадают');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await updatePassword(formState.value);

            emit('close', true);
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.textCode === 'CURRENT_PASSWORD_INCORRECT') {
                    errors.value.push('Текущий пароль некорректен');
                } else if (e.textCode === 'INVALID_PASSWORD') {
                    errors.value.push(`Пароль не соответствует требованиям, должен быть не менее 8 символов и содержать буквы и цифры или символы`);
                } else {
                    errors.value = e.formHints();
                }
            } else {
                errors.value.push('Неизвестная ошибка');
            }
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <UModal
        :title="`Изменение пароля`"
        @close="emit('close', false)"
    >
        <template #body>
            <div :class="$style.wrapper">
                <div :class="$style.form">
                    <div>
                        <div>Текущий пароль:</div>
                        <div>
                            <UInput
                                v-model="formState.currentPassword"
                                class="w-full"
                                size="xl"
                                :type="showPassword ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                                        :aria-pressed="showPassword"
                                        aria-controls="password"
                                        @click="showPassword = !showPassword"
                                    />
                                </template>
                            </UInput>
                        </div>
                    </div>
                    <div>
                        <div>Новый пароль:</div>
                        <div>
                            <UInput
                                v-model="formState.newPassword"
                                class="w-full"
                                size="xl"
                                :type="showPassword ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                                        :aria-pressed="showPassword"
                                        aria-controls="password"
                                        @click="showPassword = !showPassword"
                                    />
                                </template>
                            </UInput>
                        </div>
                    </div>
                    <div>
                        <div>Повторите новый пароль:</div>
                        <div>
                            <UInput
                                v-model="formState.newPassword2"
                                class="w-full"
                                size="xl"
                                :type="showPassword ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                                        :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
                                        :aria-pressed="showPassword"
                                        aria-controls="password"
                                        @click="showPassword = !showPassword"
                                    />
                                </template>
                            </UInput>
                        </div>
                    </div>
                </div>
                <div v-if="errors.length">
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
            </div>
        </template>
        <template #footer>
            <div class="flex justify-end">
                <UButton
                    label="Сохранить"
                    color="primary"
                    :loading="isLoading"
                    :disabled="isLoading"
                    @click="save"
                />
            </div>
        </template>
    </UModal>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .wrapper {
        display: flex;
        flex-direction: column;
        gap: 20px;

        > .form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }
</style>
