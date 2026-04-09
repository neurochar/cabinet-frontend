<script setup lang="ts">
    import type { V1AccountTenant, V1PatchAccountRequestPayload } from '~/api/generated/Api';
    import { PROFILE_PHOTO_100X100_TARGET, PROFILE_PHOTO_ORIGINAL_TARGET } from '~/core/domain/model/const/conts';
    import { RoleByID } from '~/core/domain/model/const/roles';
    import { setAppBreadcrumbs } from '~/plugins/app/model/actions/setAppBreadcrumbs';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';
    import Confirm from '../../shared/Confirm/modals/Confirm.vue';
    import type { UploadedFile } from '../../shared/FileUploader/model/types/types';
    import { showErrors, showSuccess } from '../../shared/inform/toast';
    import UpdatePassword from './modals/UpdatePassword.vue';
    import UpdateRole from './modals/UpdateRole.vue';
    import type { FormState } from './types';

    const props = defineProps<{
        id: string;
    }>();

    useSeoMeta({
        title: 'Редактирование пользователя',
    });

    setMenu('workspace', 'users');

    setAppBreadcrumbs([
        {
            name: 'Список пользователей',
            icon: 'i-lucide-users-round',
            to: '/users',
        },
        {
            name: 'Редактирование пользователя',
        },
    ]);

    const api = useApi();

    const account = ref<V1AccountTenant | null>(null);

    const profileFormState = ref<FormState>({
        profileName: '',
        profileSurname: '',
    });

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

    const isLoading = ref(false);

    const isStateInited = ref(false);

    const errors = ref<string[]>([]);

    const onlyRead = computed(() => {
        const accountRole = account.value ? RoleByID(account.value.roleId) : undefined;
        const authorRole = RoleByID(useNuxtApp().$authData.userData!.account.roleId);
        if (!accountRole || !authorRole) {
            return false;
        }

        return accountRole.rank <= authorRole.rank;
    });

    const fetchItemAndSetState = async (): Promise<V1AccountTenant | null> => {
        isLoading.value = true;
        try {
            const res = await api.v1.usersTenantPublicServiceGetAccount(props.id);

            if (res.error !== null) {
                throw res.error;
            }

            account.value = res.data!.item!;

            if (account.value) {
                profileFormState.value = {
                    ...profileFormState.value,
                    profileName: account.value.profileName,
                    profileSurname: account.value.profileSurname,
                    profilePhotos: account.value.profilePhotos,
                };
            }

            return account.value;
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.code === 404) {
                    showError({
                        statusCode: e.code,
                        statusMessage: 'Пользователь не найден',
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

    watch(
        () => props.id,
        async () => {
            isStateInited.value = false;
            const data = await fetchItemAndSetState();
            if (data) {
                isStateInited.value = true;
            }
        },
        {
            immediate: true,
        },
    );

    const save = async () => {
        if (isLoading.value || !profileFormState.value || !account.value) return;

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
            const payload: V1PatchAccountRequestPayload = {
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

            const res = await api.v1.usersTenantPublicServicePatchAccount(account.value.id, {
                payload: payload,
                skipVersionCheck: true,
                version: '0',
            });

            if (res.error !== null) {
                throw res.error;
            }

            await fetchItemAndSetState();

            showSuccess();
        } catch (e) {
            if (e instanceof ApiError) {
                errors.value = e.formHints();
            }
        } finally {
            isLoading.value = false;
        }
    };

    const overlay = useOverlay();

    const updatePassword = async () => {
        if (!account.value) return;

        const modal = overlay.create(UpdatePassword, {
            destroyOnClose: true,
            props: {
                account: account.value,
            },
        });

        const instance = modal.open();

        const shouldUpdate = await instance.result;
        if (shouldUpdate) {
            showSuccess();

            await fetchItemAndSetState();
        }
    };

    const updateRole = async () => {
        if (!account.value) return;

        const modal = overlay.create(UpdateRole, {
            destroyOnClose: true,
            props: {
                account: account.value,
            },
        });

        const instance = modal.open();

        const shouldUpdate = await instance.result;
        if (shouldUpdate) {
            showSuccess();

            await fetchItemAndSetState();
        }
    };

    const setBlockStatus = async (isBlocked: boolean) => {
        let text = '';

        switch (isBlocked) {
            case true:
                text = 'Вы действительно хотите заблокировать пользователя?';
                break;
            case false:
                text = 'Вы действительно хотите разблокировать пользователя?';
                break;
        }

        const modal = useOverlay().create(Confirm, {
            props: {
                text,
            },
            destroyOnClose: true,
        });

        const instance = modal.open();

        const shouldDo = await instance.result;
        if (shouldDo) {
            isLoading.value = true;
            try {
                const res = await api.v1.usersTenantPublicServicePatchAccount(account.value?.id || '', {
                    payload: {
                        isBlocked: isBlocked,
                    },
                    skipVersionCheck: true,
                    version: '0',
                });

                if (res.error !== null) {
                    throw res.error;
                }

                showSuccess();

                await fetchItemAndSetState();
            } catch (e) {
                if (e instanceof ApiError) {
                    errors.value = e.formHints();
                } else {
                    errors.value.push('Неизвестная ошибка');
                }
            } finally {
                isLoading.value = false;
            }
        }
    };
</script>

<template>
    <div>
        <template v-if="account">
            <div class="form_title">
                <div class="title">Аккаунт</div>
            </div>
            <div class="mt-4">
                <div class="form-table">
                    <div>
                        <div class="title">ID:</div>
                        <div class="value">{{ account.id }}</div>
                    </div>
                    <div>
                        <div class="title">Роль:</div>
                        <div class="value">
                            <div>{{ RoleByID(account.roleId)?.name }}</div>
                            <div
                                v-if="!onlyRead"
                                class="mt-2"
                            >
                                <UButton
                                    variant="subtle"
                                    @click="updateRole"
                                >
                                    Изменить роль
                                </UButton>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="title">Информация:</div>
                        <div class="value">
                            <div>
                                <span class="text-graylight-600">Последняя авторизация:</span>
                                {{ account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleString() : 'нет' }}
                            </div>
                            <div>
                                <span class="text-graylight-600">Последняя активность:</span>
                                {{ account.lastRequestAt ? new Date(account.lastRequestAt).toLocaleString() : 'нет' }}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="title">Статус:</div>
                        <div class="value">
                            <template v-if="!account.isConfirmed">
                                <div><span class="text-red-500">не подтвержден</span></div>
                            </template>
                            <template v-else>
                                <div>подтвержден</div>
                            </template>
                        </div>
                    </div>
                    <div>
                        <div class="title">Email:</div>
                        <div class="value">
                            <div>{{ account.email }}</div>
                        </div>
                    </div>
                    <div v-if="!onlyRead">
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
                    <div>
                        <div class="title">Блокировка:</div>
                        <div class="value">
                            <div>
                                <template v-if="account.isBlocked">
                                    <span class="text-red-500">заблокирован</span>
                                </template>
                                <template v-else> не заблокирован </template>
                            </div>
                            <div
                                v-if="!onlyRead"
                                class="mt-2"
                            >
                                <template v-if="account.isBlocked">
                                    <UButton
                                        variant="subtle"
                                        @click="setBlockStatus(false)"
                                    >
                                        Снять блокировку
                                    </UButton>
                                </template>
                                <template v-else>
                                    <UButton
                                        variant="subtle"
                                        @click="setBlockStatus(true)"
                                    >
                                        Заблокировать
                                    </UButton>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form_title mt-10">
                <div class="title">Профиль</div>
                <div
                    v-if="!onlyRead"
                    class="buttons"
                >
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
                v-if="errors.length && !onlyRead"
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
                            <template v-if="onlyRead">
                                <div>{{ profileFormState.profileName }}</div>
                            </template>
                            <template v-else>
                                <UInput
                                    v-model="profileFormState.profileName"
                                    size="xl"
                                    class="w-full"
                                    :disabled="isLoading"
                                />
                            </template>
                        </div>
                    </div>
                    <div>
                        <div class="title">Фамилия:</div>
                        <div class="value">
                            <template v-if="onlyRead">
                                <div>{{ profileFormState.profileSurname }}</div>
                            </template>
                            <template v-else>
                                <UInput
                                    v-model="profileFormState.profileSurname"
                                    size="xl"
                                    class="w-full"
                                    :disabled="isLoading"
                                />
                            </template>
                        </div>
                    </div>
                    <div>
                        <div class="title">
                            Основная фотография:
                            <div class="desc">Минимальное разрешение: 100x100</div>
                        </div>
                        <div class="value">
                            <template v-if="onlyRead">
                                <div v-if="profileFormState.profilePhotos">
                                    <img
                                        :src="profileFormState.profilePhotos.s100x100File?.url"
                                        alt=""
                                    />
                                </div>
                            </template>
                            <template v-else>
                                <SharedFileUploader
                                    :disabled="isLoading"
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
                            </template>
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
