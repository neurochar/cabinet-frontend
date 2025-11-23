<script setup lang="ts">
    import { ref } from 'vue';
    import { getCurrentTenantTextID } from '~/plugins/auth/model/hooks/getCurrentTenantTextID';
    import { ApiError } from '~/shared/errors/errors';
    import { checkCode } from './api/checkCode';
    import { passwordRecovery } from './api/passwordRecovery';
    import { setPasswordByCode } from './api/setPasswordByCode';

    const step = ref(1);

    const isLoading = ref(false);
    const toast = useToast();

    const showPassword = ref(false);

    const formState = ref({
        email: '',
        codeID: '',
        codeValue: '',
        newPassword: '',
        newPassword2: '',
    });

    const tenantTextID = getCurrentTenantTextID();

    const onSubmit = async () => {
        if (isLoading.value) return;

        isLoading.value = true;
        const errors: string[] = [];
        try {
            if (step.value === 1) {
                if (formState.value.email.length === 0) {
                    errors.push('E-mail не указан');
                } else {
                    const res = await passwordRecovery(formState.value.email, tenantTextID);
                    formState.value.codeID = res.codeID;
                    step.value = 2;
                }
            } else if (step.value === 2) {
                if (formState.value.codeValue.length === 0) {
                    errors.push('Код не указан');
                } else {
                    const res = await checkCode({
                        id: formState.value.codeID,
                        code: formState.value.codeValue,
                    });

                    if (!res.success) {
                        errors.push(`Код неверный, осталось попыток: ${res.maxAttempts}`);
                    } else {
                        step.value = 3;
                    }
                }
            } else if (step.value === 3) {
                if (formState.value.newPassword.length < 8) {
                    errors.push('Пароль должен быть не менее 8 символов');
                } else if (formState.value.newPassword !== formState.value.newPassword2) {
                    errors.push('Пароли не совпадают');
                } else {
                    const res = await setPasswordByCode({
                        id: formState.value.codeID,
                        code: formState.value.codeValue,
                        password: formState.value.newPassword,
                        password2: formState.value.newPassword2,
                    });

                    if (!res.success) {
                        if (res.reason === 'password') {
                            errors.push(`Пароль не соответствует требованиям, должен быть не менее 8 символов и содержать буквы и цифры или символы`);
                        } else {
                            errors.push(`Неизвестная ошибка`);
                        }
                    } else {
                        toast.add({
                            title: 'Успех',
                            description: 'Пароль установлен',
                            color: 'success',
                            icon: 'i-lucide-check-circle',
                        });

                        navigateTo('/');
                    }
                }
            }
        } catch (err) {
            if (err instanceof ApiError) {
                errors.push(...err.formHints());
            } else {
                errors.push('Неизвестная ошибка');
            }
        } finally {
            isLoading.value = false;
        }

        if (errors.length) {
            toast.add({
                title: 'Возникли ошибки',
                description: errors.join('\n'),
                color: 'error',
                icon: 'i-lucide-alert-triangle',
            });
        }
    };
</script>

<template>
    <div :class="$style.wrapper">
        <div :class="$style.logo" />
        <div :class="$style.title">Восстановление доступа</div>

        <div :class="$style.form">
            <div :class="$style.desc">
                <template v-if="step === 1"> На указанный email будет отправлено письмо с инструкцией по восстановлению доступа. </template>
                <template v-else-if="step === 2"> Введите код из письма. </template>
                <template v-else> Введите новый пароль. </template>
            </div>
            <div :class="$style.items">
                <template v-if="step === 1">
                    <div :class="$style.line">
                        <div :class="$style.label">Email:</div>
                        <UInput
                            v-model="formState.email"
                            class="w-full"
                            size="xl"
                        />
                    </div>
                </template>
                <template v-if="step === 2">
                    <div :class="$style.line">
                        <div :class="$style.label">Код:</div>
                        <UInput
                            v-model="formState.codeValue"
                            class="w-full"
                            size="xl"
                        />
                    </div>
                </template>
                <template v-if="step === 3">
                    <div :class="$style.line">
                        <div :class="$style.label">Новый пароль:</div>
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
                    <div :class="$style.line">
                        <div :class="$style.label">Повторите новый пароль:</div>
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
                </template>
            </div>

            <div class="mt-6 flex justify-center">
                <UButton
                    size="xl"
                    trailing-icon="i-lucide-arrow-right"
                    :loading="isLoading"
                    @click="onSubmit"
                >
                    <template v-if="step === 1"> Восстановить </template>
                    <template v-else-if="step === 2"> Отправить </template>
                    <template v-else> Сохранить </template>
                </UButton>
            </div>

            <div class="mt-8 flex justify-center">
                <NuxtLink
                    to="/"
                    :class="$style.link"
                >
                    Вернуться к входу
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .wrapper {
        width: 100%;
        max-width: 360px;

        .logo {
            background: url('@/assets/images/logo_black.svg') no-repeat center top;
            background-size: 100% auto;
            max-width: 360px;
            padding-top: 12%;
            margin: 0 auto 30px auto;
        }

        > .title {
            font-size: 32px;
            text-align: center;
            margin-bottom: 20px;
            font-family: 'Strong';

            .width-size-sm-less({
                font-size: 24px;
                margin-bottom: 15px;
            });
        }

        > .form {
            background-color: var(--color-neutral-200);
            border-radius: 7px;
            padding: 30px;

            .width-size-sm-less({
                padding: 20px;
            });

            > .desc {
                margin-bottom: 20px;
                color: var(--color-graylight-700);
            }

            > .items {
                display: flex;
                flex-direction: column;
                gap: 15px;

                > .line {
                    > .label {
                        margin-bottom: 5px;
                    }
                }
            }
        }
    }

    .link {
        color: var(--color-blue-500);
        text-decoration: underline;
    }
</style>
