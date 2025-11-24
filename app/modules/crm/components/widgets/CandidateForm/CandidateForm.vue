<script setup lang="ts">
    import { ICandidateItemGenderConfig, type ICandidateItem, type ICandidateItemState } from '~/modules/crm/domain/model/types/candidate';

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

    const gendersListOptions = computed(() => {
        return Object.entries(ICandidateItemGenderConfig).map(([key, value]) => ({
            value: Number(key),
            label: value.label,
        }));
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
        <div>
            <div class="title">
                Пол:
                <div class="desc">Указывать необязательно, но знание поможет нашим алгоритмам точнее работать карточкой кандидата</div>
            </div>
            <div class="value">
                <USelect
                    v-model="dataModel.candidateGender"
                    size="xl"
                    :items="gendersListOptions"
                    class="w-full"
                    :disabled="disabled"
                />
            </div>
        </div>
        <div>
            <div class="title">
                Дата рождения:
                <div class="desc">Указывать необязательно, но знание поможет нашим алгоритмам точнее работать карточкой кандидата</div>
            </div>
            <div class="value">
                <SharedDatetimePicker
                    v-model="dataModel.candidateBirthday"
                    size="xl"
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
