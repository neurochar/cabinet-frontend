<script setup lang="ts">
    import { V1PersonalityTraitPriority, type V1PersonalityTrait, type V1TestingProfile } from '~/api/generated/Api';
    import type { ICicleMapItem } from '~/core/components/shared/CircleSelector/model/types/types';
    import { IPersonalityTraitPriorityConfig, type IProfileItemState } from '~/modules/testing/domain/model/types/profile';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
        personalityTraitsList: V1PersonalityTrait[];
    }>();

    const dataModel = defineModel<IProfileItemState>({ required: true });

    const dataItem = defineModel<V1TestingProfile | null>('dataItem', { required: true });

    const updateTraitPriorityInMap = (traitID: string, priority?: V1PersonalityTraitPriority) => {
        if (!priority || priority === V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE) {
            dataModel.value.personalityTraits.map = Object.fromEntries(Object.entries(dataModel.value.personalityTraits.map!).filter(([id]) => id !== traitID));
        } else {
            if (dataModel.value.personalityTraits.map![traitID]) {
                dataModel.value.personalityTraits.map![traitID]!.priority = priority;
            } else {
                dataModel.value.personalityTraits.map![traitID] = {
                    priority: priority,
                    target: 5,
                };
            }
        }
    };

    const updateTraitTargetInMap = (traitID: string, target: number) => {
        if (dataModel.value.personalityTraits.map![traitID]) {
            dataModel.value.personalityTraits.map![traitID]!.target = target;
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

    const priorityMap: ICicleMapItem<V1PersonalityTraitPriority>[] = [
        {
            value: V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE,
            color: '#d9d9d9',
            title: IPersonalityTraitPriorityConfig[V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE].label,
        },
        {
            value: V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_LOW,
            color: '#8deb81',
            title: IPersonalityTraitPriorityConfig[V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_LOW].label,
        },
        {
            value: V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_MEDIUM,
            color: '#e8e484',
            title: IPersonalityTraitPriorityConfig[V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_MEDIUM].label,
        },
        {
            value: V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_HIGH,
            color: '#f73131',
            title: IPersonalityTraitPriorityConfig[V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_HIGH].label,
        },
    ];

    const priorityMapBgColor = (priority: V1PersonalityTraitPriority): string | undefined => {
        switch (priority) {
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE:
                return '#fafafa';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_LOW:
                return '#f3fff2';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_MEDIUM:
                return '#fffeef';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_HIGH:
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
            <div
                :style="{
                    backgroundColor: priorityMapBgColor(
                        dataModel.personalityTraits.map![trait.id]?.priority || V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE,
                    ),
                }"
            >
                <div class="title">
                    {{ trait.name }}:
                    <div
                        v-if="trait.description"
                        class="desc"
                    >
                        {{ trait.description }}
                    </div>
                </div>
                <div class="value">
                    <div :class="$style.prioritySelector">
                        <div :class="$style.title">Приоритет:</div>
                        <div :class="$style.input">
                            <SharedCircleSelector
                                :model-value="
                                    dataModel.personalityTraits.map![trait.id]?.priority || V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE
                                "
                                :map="priorityMap"
                                @update:model-value="updateTraitPriorityInMap(trait.id, $event)"
                            />
                        </div>
                        <div :class="$style.value">
                            <span
                                :class="
                                    (dataModel.personalityTraits.map![trait.id]?.priority || V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE) !==
                                    V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE
                                        ? $style.bold
                                        : undefined
                                "
                                >{{
                                    IPersonalityTraitPriorityConfig[
                                        dataModel.personalityTraits.map![trait.id]?.priority || V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE
                                    ].label
                                }}</span
                            >
                        </div>
                    </div>
                    <div
                        v-if="dataModel.personalityTraits.map?.[trait.id]"
                        :class="$style.sliderSelector"
                    >
                        <div :class="$style.title">Целевое значение:</div>
                        <div :class="$style.input">
                            <USlider
                                :min="0"
                                :max="10"
                                :model-value="dataModel.personalityTraits.map[trait.id]?.target || 0"
                                color="secondary"
                                @update:model-value="updateTraitTargetInMap(trait.id, Number($event))"
                            />
                        </div>
                        <div :class="$style.names">
                            <div :class="$style.left">{{ trait.leftStateName }}</div>
                            <div :class="$style.value">{{ dataModel.personalityTraits.map[trait.id]?.target || 0 }}</div>
                            <div :class="$style.right">{{ trait.rightStateName }}</div>
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
