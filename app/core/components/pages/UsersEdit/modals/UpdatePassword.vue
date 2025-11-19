<script setup lang="ts">
    import { patchAccount } from '~/core/domain/api/patchAccount';
    import type { IUserAccount } from '~/core/domain/model/types/users';
    import { ApiError } from '~/shared/errors/errors';

    const emit = defineEmits<{ close: [boolean] }>();

    const props = defineProps<{
        account: IUserAccount;
    }>();

    const showPassword = ref(false);

    const errors = ref<string[]>([]);

    const isLoading = ref(false);

    const formState = ref<{ password: string }>({
        password: '',
    });

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        if (formState.value.password.length < 1) {
            errors.value.push('Пароль не указан');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await patchAccount(props.account.id, {
                _version: props.account._version,
                password: formState.value.password,
            });

            emit('close', true);
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.textCode === 'INVALID_PASSWORD') {
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
                <div>Пароль:</div>
                <div>
                    <UInput
                        v-model="formState.password"
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
    }
</style>
