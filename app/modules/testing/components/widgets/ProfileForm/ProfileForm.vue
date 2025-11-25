<script setup lang="ts">
    import type { ICicleMapItem } from '~/core/components/shared/CircleSelector/model/types/types';
    import type { IPersonalityTraitItem } from '~/modules/testing/domain/model/types/personality_trait';
    import {
        IProfileItemPersonalityTraitMapPriorityConfig,
        priorityToConfig,
        type IProfileItem,
        type IProfileItemState,
    } from '~/modules/testing/domain/model/types/profile';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
        personalityTraitsList: IPersonalityTraitItem[];
    }>();

    const dataModel = defineModel<IProfileItemState>({ required: true });

    const dataItem = defineModel<IProfileItem | null>('dataItem', { required: true });

    const updateTraitPriorityInMap = (traitID: number, priority: number) => {
        if (priority === 0) {
            dataModel.value.personalityTraitsMap = Object.fromEntries(
                Object.entries(dataModel.value.personalityTraitsMap).filter(([id]) => id !== traitID.toString()),
            );
        } else {
            if (dataModel.value.personalityTraitsMap[traitID.toString()]) {
                dataModel.value.personalityTraitsMap[traitID.toString()]!.priority = priority;
            } else {
                dataModel.value.personalityTraitsMap[traitID.toString()] = {
                    priority: priority,
                    target: 5,
                };
            }
        }
    };

    const updateTraitTargetInMap = (traitID: number, target: number) => {
        if (dataModel.value.personalityTraitsMap[traitID.toString()]) {
            dataModel.value.personalityTraitsMap[traitID.toString()]!.target = target;
        }
    };

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

    const priorityMap: ICicleMapItem[] = [
        {
            value: 0,
            color: '#d9d9d9',
            title: IProfileItemPersonalityTraitMapPriorityConfig[0].label,
        },
        {
            value: 1,
            color: '#8deb81',
            title: IProfileItemPersonalityTraitMapPriorityConfig[1].label,
        },
        {
            value: 2,
            color: '#e8e484',
            title: IProfileItemPersonalityTraitMapPriorityConfig[2].label,
        },
        {
            value: 3,
            color: '#f73131',
            title: IProfileItemPersonalityTraitMapPriorityConfig[3].label,
        },
    ];

    const priorityMapBgColor = (priority: number): string | undefined => {
        switch (priority) {
            case 0:
                return '#fafafa';
            case 1:
                return '#f3fff2';
            case 2:
                return '#fffeef';
            case 3:
                return '#fff2f2';
            default:
                return undefined;
        }
    };
</script>

<template>
    <div
        v-if="show"
        class="form-table"
    >
        <div>
            <div class="title">Название:</div>
            <div class="value">
                <UInput
                    v-model="dataModel.name"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                />
            </div>
        </div>

        <template
            v-for="trait in personalityTraitsList"
            :key="trait.id"
        >
            <div :style="{ backgroundColor: priorityMapBgColor(dataModel.personalityTraitsMap[trait.ID.toString()]?.priority || 0) }">
                <div class="title">
                    {{ trait.Name }}:
                    <div
                        v-if="trait.Description"
                        class="desc"
                    >
                        {{ trait.Description }}
                    </div>
                </div>
                <div class="value">
                    <div :class="$style.prioritySelector">
                        <div :class="$style.title">Приоритет:</div>
                        <div :class="$style.input">
                            <SharedCircleSelector
                                :model-value="dataModel.personalityTraitsMap[trait.ID.toString()]?.priority || 0"
                                :map="priorityMap"
                                @update:model-value="updateTraitPriorityInMap(trait.ID, Number($event))"
                            />
                        </div>
                        <div :class="$style.value">
                            <span :class="(dataModel.personalityTraitsMap[trait.ID.toString()]?.priority || 0) > 0 ? $style.bold : undefined">{{
                                priorityToConfig(dataModel.personalityTraitsMap[trait.ID.toString()]?.priority || 0)?.label
                            }}</span>
                        </div>
                    </div>
                    <div
                        v-if="dataModel.personalityTraitsMap[trait.ID.toString()]"
                        :class="$style.sliderSelector"
                    >
                        <div :class="$style.title">Целевое значение:</div>
                        <div :class="$style.input">
                            <USlider
                                :min="0"
                                :max="10"
                                :model-value="dataModel.personalityTraitsMap[trait.ID.toString()]?.target || 0"
                                color="secondary"
                                @update:model-value="updateTraitTargetInMap(trait.ID, Number($event))"
                            />
                        </div>
                        <div :class="$style.names">
                            <div :class="$style.left">{{ trait.LeftStateName }}</div>
                            <div :class="$style.value">{{ dataModel.personalityTraitsMap[trait.ID.toString()]?.target || 0 }}</div>
                            <div :class="$style.right">{{ trait.RightStateName }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .prioritySelector {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;

        > .value {
            margin-left: auto;

            > .bold {
                font-size: 16px;
            }
        }
    }

    .sliderSelector {
        margin-top: 20px;

        > .input {
            margin-top: 15px;
        }

        > .names {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
            font-weight: bold;
        }
    }
</style>
