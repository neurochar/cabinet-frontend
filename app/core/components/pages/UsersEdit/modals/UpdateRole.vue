<script setup lang="ts">
    import type { V1AccountTenant } from '~/api/generated/Api';
    import { getAvailableRolesForCreateUser } from '~/core/domain/hooks/getAvailableRolesForCreateUser';
    import { ApiError } from '~/shared/errors/errors';

    const emit = defineEmits<{ close: [boolean] }>();

    const props = defineProps<{
        account: V1AccountTenant;
    }>();

    const api = useApi();

    const errors = ref<string[]>([]);

    const isLoading = ref(false);

    const rolesList = computed(() => {
        return getAvailableRolesForCreateUser(useNuxtApp().$authData.userData!.account.roleId);
    });

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

    const formState = ref<{ roleID: string }>({
        roleID: props.account.roleId,
    });

    const save = async () => {
        if (isLoading.value) return;

        errors.value = [];

        isLoading.value = true;
        try {
            const res = await api.v1.usersTenantPublicServicePatchAccount(props.account.id, {
                payload: {
                    roleId: formState.value.roleID,
                },
                skipVersionCheck: true,
                version: '0',
            });

            if (res.error !== null) {
                throw res.error;
            }

            emit('close', true);
        } catch (e) {
            if (e instanceof ApiError) {
                errors.value = e.formHints();
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
        :title="`Изменение роли`"
        @close="emit('close', false)"
    >
        <template #body>
            <div :class="$style.wrapper">
                <div>Роль:</div>
                <div>
                    <USelect
                        v-model="formState.roleID"
                        :items="rolesListOptions"
                        class="w-48"
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
