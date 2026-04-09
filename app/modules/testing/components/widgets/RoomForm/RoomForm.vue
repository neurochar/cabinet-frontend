<script setup lang="ts">
    import type { V1TestingRoom } from '~/api/generated/Api';
    import type { IRoomItemState } from '~/modules/testing/domain/model/types/room';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
    }>();

    const dataModel = defineModel<IRoomItemState>({ required: true });

    const dataItem = defineModel<V1TestingRoom | null>('dataItem', { required: true });

    const show = ref(true);

    const rebuild = async () => {
        await syncAllData();

        show.value = false;
        await nextTick();
        show.value = true;
    };

    const syncAllData = async () => {};

    defineExpose({
        syncAllData,
        rebuild,
    });
</script>

<template>
    <div
        v-if="show"
        class="form-table"
    >
        <div>
            <div class="title">Профиль:</div>
            <div class="value">
                <TestingSharedSelectProfile
                    v-model="dataModel.profileID"
                    :disabled="disabled"
                    size="xl"
                    class="w-full"
                />
            </div>
        </div>
        <div>
            <div class="title">Кандидат:</div>
            <div class="value">
                <CrmSharedSelectCandidate
                    v-model="dataModel.candidateID"
                    :disabled="disabled"
                    size="xl"
                    class="w-full"
                />
            </div>
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
