<script setup lang="ts">
    import type { TestingWidgetRoomForm } from '#components';
    import { showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { createRoom } from '~/modules/testing/domain/api/room/createRoom';
    import { checkRoomState } from '~/modules/testing/domain/hooks/checkRoomState';
    import type { IRoomItemState } from '~/modules/testing/domain/model/types/room';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    useSeoMeta({
        title: 'Создание объекта',
    });

    setMenu(module.urlName, 'rooms');

    setModuleBreadcrums([
        {
            name: 'Список комнат тестирования',
            to: `/rooms`,
        },
        {
            name: 'Создание объекта',
        },
    ]);

    const form = ref<InstanceType<typeof TestingWidgetRoomForm> | null>(null);

    const initState: IRoomItemState = {
        candidateID: null,
        profileID: null,
    };

    const itemObject = ref<null>(null);

    const itemState = ref<IRoomItemState>(initState);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const isLoadingAnything = computed(() => isLoading.value);

    const save = async () => {
        if (isLoadingAnything.value || !itemState.value) return;

        if (form.value) {
            await form.value.syncAllData();
        }

        errors.value = checkRoomState(itemState.value);

        if (errors.value.length) return;

        isLoading.value = true;
        try {
            const data = await createRoom(itemState.value);

            showSuccess();

            await navigateTo(`/${module.urlName}/rooms/${data.id}`);
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
        <div class="form_title">
            <div class="title">Комната</div>
            <div class="buttons">
                <UButton
                    :disabled="isLoadingAnything"
                    :loading="isLoadingAnything"
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
            <TestingWidgetRoomForm
                v-if="itemState"
                ref="form"
                v-model="itemState"
                v-model:data-item="itemObject"
                mode="new"
                :disabled="isLoadingAnything"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
