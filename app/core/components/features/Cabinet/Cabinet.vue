<script setup lang="ts">
    import { PROFILE_PHOTO_100X100_TARGET, PROFILE_PHOTO_ORIGINAL_TARGET } from '~/core/domain/model/const/conts';
    import { RoleByID } from '~/core/domain/model/const/roles';
    import { doAuth } from '~/plugins/auth/model';
    import { clearAuthUserData } from '~/plugins/auth/model/actions/clearAuthData';
    import { ApiError } from '~/shared/errors/errors';
    import type { UploadedFile } from '../../shared/FileUploader/model/types/types';
    import { updateAccount } from './api/updateAccount';
    import UpdateEmail from './modals/UpdateEmail.vue';
    import UpdatePassword from './modals/UpdatePassword.vue';

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const toast = useToast();

    const profileFormState = ref({ ...useNuxtApp().$authData.userData!.account });

    const disabled = ref(false);

    const onUpdateImage = (files: UploadedFile[]) => {
        if (files.length === 0) {
            profileFormState.value.profilePhoto100x100File = null;
            profileFormState.value.profilePhotoOriginalFile = null;
            return;
        }

        const file = files[0]!;
        profileFormState.value.profilePhoto100x100File = file.targets[PROFILE_PHOTO_100X100_TARGET]!;
        profileFormState.value.profilePhotoOriginalFile = file.targets[PROFILE_PHOTO_ORIGINAL_TARGET]!;
    };

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        if (profileFormState.value.profileName.length < 1) {
            errors.value.push('Имя не указано');
        }

        if (profileFormState.value.profileSurname.length < 1) {
            errors.value.push('Фамилия не указана');
        }

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            await updateAccount({
                _version: profileFormState.value._version,
                _skipVersionCheck: true,
                profileName: profileFormState.value.profileName,
                profileSurname: profileFormState.value.profileSurname,
                profilePhotoOriginalFileID: profileFormState.value.profilePhotoOriginalFile ? profileFormState.value.profilePhotoOriginalFile.id : null,
                profilePhoto100x100FileID: profileFormState.value.profilePhoto100x100File ? profileFormState.value.profilePhoto100x100File.id : null,
            });

            await doAuth();
            profileFormState.value = { ...useNuxtApp().$authData.userData!.account };

            showSaveSuccess();
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

    const overlay = useOverlay();

    const showSaveSuccess = () => {
        toast.add({
            title: 'Успех',
            description: 'Данные сохранены',
            color: 'success',
            icon: 'i-lucide-check-circle',
        });
    };

    const updateEmail = async () => {
        const modal = overlay.create(UpdateEmail, {
            destroyOnClose: true,
        });

        const instance = modal.open();

        const shouldUpdate = await instance.result;
        if (shouldUpdate) {
            showSaveSuccess();

            isLoading.value = true;
            await doAuth();
            isLoading.value = false;
        }
    };

    const updatePassword = async () => {
        const modal = overlay.create(UpdatePassword, {
            destroyOnClose: true,
        });

        const instance = modal.open();

        if (await instance.result) {
            setTimeout(() => {
                clearAuthUserData();
            }, 100);

            navigateTo('/');
        }
    };
</script>

<template>
    <div>
        <div class="form_title">
            <div class="title">Мой аккаунт</div>
        </div>
        <div class="mt-4">
            <div class="form-table">
                <div>
                    <div class="title">Роль:</div>
                    <div class="value">{{ RoleByID(useNuxtApp().$authData.userData!.account.roleID)?.name }}</div>
                </div>
                <div>
                    <div class="title">Email:</div>
                    <div class="value">
                        <div>{{ useNuxtApp().$authData.userData!.account.email }}</div>
                        <!--
                        <div class="mt-2">
                            <UButton
                                color="graylight"
                                @click="updateEmail"
                            >
                                Изменить email
                            </UButton>
                        </div>
                        -->
                    </div>
                </div>
                <div>
                    <div class="title">Пароль:</div>
                    <div class="value">
                        <UButton
                            color="graylight"
                            @click="updatePassword"
                        >
                            Изменить пароль
                        </UButton>
                    </div>
                </div>
            </div>
        </div>

        <div class="form_title mt-10">
            <div class="title">Мой профиль</div>
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
                    <div class="title">Имя:</div>
                    <div class="value">
                        <UInput
                            v-model="profileFormState.profileName"
                            size="xl"
                            class="w-full"
                            :disabled="disabled"
                        />
                    </div>
                </div>
                <div>
                    <div class="title">Фамилия:</div>
                    <div class="value">
                        <UInput
                            v-model="profileFormState.profileSurname"
                            size="xl"
                            class="w-full"
                            :disabled="disabled"
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
                            :disabled="disabled"
                            :lead-target="PROFILE_PHOTO_ORIGINAL_TARGET"
                            mode="solo"
                            upload-url="v1/users/photo_file"
                            accept-types="image/jpeg,image/png,image/webp,image/gif"
                            :model-value="
                                profileFormState.profilePhotoOriginalFile && profileFormState.profilePhoto100x100File
                                    ? [
                                          {
                                              targets: {
                                                  [PROFILE_PHOTO_ORIGINAL_TARGET]: profileFormState.profilePhotoOriginalFile,
                                                  [PROFILE_PHOTO_100X100_TARGET]: profileFormState.profilePhoto100x100File,
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
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
