<script setup lang="ts">
    import type { ICandidateItem, ICandidateItemState } from '~/modules/crm/domain/model/types/candidate';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
    }>();

    const dataModel = defineModel<ICandidateItemState>({ required: true });

    const dataItem = defineModel<ICandidateItem | null>('dataItem', { required: true });

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
            <div class="title">Имя:</div>
            <div class="value">
                <UInput
                    v-model="dataModel.candidateName"
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
                    v-model="dataModel.candidateSurname"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                />
            </div>
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .linksBlockTitle {
        font-size: 20px;
        margin-bottom: 20px;
    }
</style>
