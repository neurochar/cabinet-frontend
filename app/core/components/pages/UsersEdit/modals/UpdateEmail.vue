<script setup lang="ts">
    import { patchAccount } from '~/core/domain/api/patchAccount';
    import type { IUser } from '~/core/domain/model/types/users';
    import { ApiError } from '~/shared/errors/errors';

    const emit = defineEmits<{ close: [boolean] }>();

    const props = defineProps<{
        user: IUser;
    }>();

    const errors = ref<string[]>([]);

    const isLoading = ref(false);

    const formState = ref<{ email: string }>({
        email: props.user.account.email,
    });

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        if (formState.value.email.length < 1) {
            errors.value.push('Email не указан');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await patchAccount(props.user.account.id, {
                _version: props.user.account._version,
                email: formState.value.email,
            });

            emit('close', true);
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.textCode === 'UNIQUE_VIOLATION' && e.details.field === 'email') {
                    errors.value.push('Email занят другим пользователем');
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
        :title="`Изменение email`"
        @close="emit('close', false)"
    >
        <template #body>
            <div :class="$style.wrapper">
                <div>Email:</div>
                <div>
                    <UInput
                        v-model="formState.email"
                        size="xl"
                    />
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
