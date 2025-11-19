<script setup lang="ts">
    import { SharedFileUploader } from '#components';
    import { createUser } from '~/core/domain/api/createUser';
    import { getAvailableRolesForCreateUser } from '~/core/domain/hooks/getAvailableRolesForCreateUser';
    import { PROFILE_PHOTO_100X100_TARGET, PROFILE_PHOTO_ORIGINAL_TARGET } from '~/core/domain/model/const/conts';
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';
    import generatePassword from '~/shared/helpers/password';
    import type { UploadedFile } from '../../shared/FileUploader/model/types/types';
    import { showSuccess } from '../../shared/inform/toast';
    import type { FormState } from './types';

    useSeoMeta({
        title: 'Создание пользователя',
    });

    setMenu('workspace', 'users');

    setAppBreadcrumbs([
        {
            name: 'Список пользователей',
            icon: 'i-lucide-users-round',
            to: '/users',
        },
        {
            name: 'Создание пользователя',
        },
    ]);

    const genPassword = () => {
        itemState.value.password = generatePassword(10, { symbols: false });
    };

    const rolesList = computed(() => {
        return getAvailableRolesForCreateUser(useNuxtApp().$authData.userData!.account.roleID);
    });

    const itemState = ref<FormState>({
        email: '',
        roleID: rolesList.value.length ? rolesList.value[rolesList.value.length - 1]!.id : 0,
        password: '',

        profileName: '',
        profileSurname: '',
        profilePhotoOriginalFile: null,
        profilePhoto100x100File: null,
    });

    genPassword();

    const onUpdateImage = (files: UploadedFile[]) => {
        if (files.length === 0) {
            itemState.value.profilePhoto100x100File = null;
            itemState.value.profilePhotoOriginalFile = null;
            return;
        }

        const file = files[0]!;
        itemState.value.profilePhoto100x100File = file.targets[PROFILE_PHOTO_100X100_TARGET]!;
        itemState.value.profilePhotoOriginalFile = file.targets[PROFILE_PHOTO_ORIGINAL_TARGET]!;
    };

    const rolesListOptions = computed(() => {
        return rolesList.value
            ? rolesList.value.map((item) => {
                  return {
                      label: item.name,
                      value: item.id,
                  };
              })
            : [];
    });

    const showPassword = ref(false);

    const isLoading = ref(false);

    const isStateInited = ref(true);

    const errors = ref<string[]>([]);

    const toast = useToast();

    const save = async () => {
        if (isLoading.value || !itemState.value) return;

        errors.value = [];

        if (itemState.value.email.length < 1) {
            errors.value.push('Email не указан');
        }

        if (itemState.value.password.length < 1) {
            errors.value.push('Пароль не указан');
        }

        if (itemState.value.profileName.length < 1) {
            errors.value.push('Имя не указано');
        }

        if (itemState.value.profileSurname.length < 1) {
            errors.value.push('Фамилия не указана');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const data = await createUser({
                email: itemState.value.email,
                password: itemState.value.password,
                roleID: itemState.value.roleID,
                profileName: itemState.value.profileName,
                profileSurname: itemState.value.profileSurname,
                profilePhoto100x100FileID: itemState.value.profilePhoto100x100File ? itemState.value.profilePhoto100x100File.id : null,
                profilePhotoOriginalFileID: itemState.value.profilePhotoOriginalFile ? itemState.value.profilePhotoOriginalFile.id : null,
            });

            showSuccess();

            navigateTo(`/users/${data.id}`);
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
        <template v-if="!rolesList.length"> <WidgetError :code="403" /></template>
        <template v-else>
            <div class="form_title">
                <div class="title">Аккаунт</div>
                <div class="buttons">
                    <UButton
                        :disabled="isLoading"
                        :loading="isLoading"
                        @click="save"
                    >
                        Создать
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
                        <div class="title">Роль:</div>
                        <div class="value">
                            <USelect
                                v-model="itemState.roleID"
                                :items="rolesListOptions"
                                size="xl"
                                class="w-full"
                                :disabled="isLoading"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">Email:</div>
                        <div class="value">
                            <UInput
                                v-model="itemState.email"
                                size="xl"
                                class="w-full"
                                :disabled="isLoading"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">Пароль:</div>
                        <div class="value">
                            <div>
                                <UInput
                                    v-model="itemState.password"
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
                            <div class="mt-2">
                                <UButton
                                    variant="subtle"
                                    @click="genPassword"
                                >
                                    Сгенерировать пароль
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form_title mt-10">
                <div class="title">Профиль</div>
            </div>
            <div class="mt-4">
                <div class="form-table">
                    <div>
                        <div class="title">Имя:</div>
                        <div class="value">
                            <UInput
                                v-model="itemState.profileName"
                                size="xl"
                                class="w-full"
                                :disabled="isLoading"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">Фамилия:</div>
                        <div class="value">
                            <UInput
                                v-model="itemState.profileSurname"
                                size="xl"
                                class="w-full"
                                :disabled="isLoading"
                            />
                        </div>
                    </div>
                    <div>
                        <div class="title">
                            Основная фотография:
                            <div class="desc">Минимальное разрешение: 100x100</div>
                        </div>
                        <div class="value">
                            <SharedFileUploader
                                :disabled="isLoading"
                                :lead-target="PROFILE_PHOTO_ORIGINAL_TARGET"
                                mode="solo"
                                upload-url="v1/users/photo_file"
                                accept-types="image/jpeg,image/png,image/webp,image/gif"
                                :model-value="
                                    itemState.profilePhotoOriginalFile && itemState.profilePhoto100x100File
                                        ? [
                                              {
                                                  targets: {
                                                      [PROFILE_PHOTO_ORIGINAL_TARGET]: itemState.profilePhotoOriginalFile,
                                                      [PROFILE_PHOTO_100X100_TARGET]: itemState.profilePhoto100x100File,
                                                  },
                                              },
                                          ]
                                        : []
                                "
                                @update:model-value="onUpdateImage"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
