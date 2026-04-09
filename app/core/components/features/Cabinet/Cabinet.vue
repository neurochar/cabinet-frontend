<script setup lang="ts">
    import type { V1UpdateMyProfileRequestPayload } from '~/api/generated/Api';
    import { PROFILE_PHOTO_100X100_TARGET, PROFILE_PHOTO_ORIGINAL_TARGET } from '~/core/domain/model/const/conts';
    import { RoleByID } from '~/core/domain/model/const/roles';
    import { doAuth } from '~/plugins/auth/model';
    import { clearAuthUserData } from '~/plugins/auth/model/actions/clearAuthData';
    import type { UploadedFile } from '../../shared/FileUploader/model/types/types';
    import UpdatePassword from './modals/UpdatePassword.vue';

    const isLoading = ref(false);

    const api = useApi();

    const errors = ref<string[]>([]);

    const toast = useToast();

    const profileFormState = ref({ ...useNuxtApp().$authData.userData!.account });

    const disabled = ref(false);

    const onUpdateImage = (files: UploadedFile[]) => {
        if (files.length === 0) {
            profileFormState.value.profilePhotos = undefined;
            return;
        }

        const file = files[0]!;
        profileFormState.value.profilePhotos = {
            originalFile: file.targets[PROFILE_PHOTO_ORIGINAL_TARGET]!,
            s100x100File: file.targets[PROFILE_PHOTO_100X100_TARGET]!,
        };
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
            const payload: V1UpdateMyProfileRequestPayload = {
                profileName: profileFormState.value.profileName,
                profileSurname: profileFormState.value.profileSurname,
            };

            if (!profileFormState.value.profilePhotos) {
                payload.profilePhotosClear = true;
            } else {
                payload.profilePhotos = {
                    originalFileId: profileFormState.value.profilePhotos.originalFile!.id!,
                    s100x100FileId: profileFormState.value.profilePhotos.s100x100File!.id!,
                };
            }

            const res = await api.v1.usersTenantPublicServiceUpdateMyProfile({
                payload: payload,
                skipVersionCheck: true,
                version: '0',
            });

            if (res.error !== null) {
                errors.value = res.error.formHints();
            } else {
                await doAuth();
                profileFormState.value = { ...useNuxtApp().$authData.userData!.account };

                showSaveSuccess();
            }
        } catch (e: unknown) {
            errors.value = ['Неизвестная ошибка'];
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
                    <div class="value">{{ RoleByID(useNuxtApp().$authData.userData!.account.roleId)?.name }}</div>
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
                            upload-url="/v1/tenant/users/profile-photo"
                            accept-types="image/jpeg,image/png,image/webp,image/gif"
                            :model-value="
                                profileFormState.profilePhotos?.originalFile && profileFormState.profilePhotos?.s100x100File
                                    ? [
                                          {
                                              targets: {
                                                  [PROFILE_PHOTO_ORIGINAL_TARGET]: profileFormState.profilePhotos.originalFile,
                                                  [PROFILE_PHOTO_100X100_TARGET]: profileFormState.profilePhotos.s100x100File,
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
