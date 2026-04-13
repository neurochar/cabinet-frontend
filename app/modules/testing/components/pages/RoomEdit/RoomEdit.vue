<script setup lang="ts">
    import { V1PersonalityTraitPriority, V1TestingRoomResultAnalyzeHiringDecision, type V1TestingRoom } from '~/api/generated/Api';
    import { showErrors } from '~/core/components/shared/inform/toast';
    import { module as crmModule } from '~/modules/crm/const';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { loadPersonalityTraitsList } from '~/modules/testing/domain/api/personality_trait/fetchPersonalityTraitsList';
    import { IPersonalityTraitPriorityConfig } from '~/modules/testing/domain/model/types/profile';
    import { hiringDecisioToText, IRoomStatusConfig } from '~/modules/testing/domain/model/types/room';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';

    const props = defineProps<{
        id: string;
    }>();

    useSeoMeta({
        title: 'Просмотр объекта',
    });

    setMenu(module.urlName, 'rooms');

    setModuleBreadcrums([
        {
            name: 'Список комнат тестирования',
            to: `/rooms`,
        },
        {
            name: 'Просмотр объекта',
        },
    ]);

    const api = useApi();

    const itemObject = ref<V1TestingRoom | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: personalityTraitsList } = loadPersonalityTraitsList();

    const isLoadingAnything = computed(() => isLoading.value || !personalityTraitsList.value);

    const fetchItem = async (): Promise<V1TestingRoom | null> => {
        isLoading.value = true;
        try {
            const res = await api.v1.testingPublicServiceGetRoom(props.id);

            if (res.error !== null) {
                throw res.error;
            }

            return res.data?.item || null;
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.code === 404) {
                    showError({
                        statusCode: e.code,
                        statusMessage: 'Объект не найден',
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

    const updateItemState = (item: V1TestingRoom) => {
        itemObject.value = item;
    };

    watch(
        () => props.id,
        async () => {
            const data = await fetchItem();
            if (data) {
                updateItemState(data);
            }
        },
        {
            immediate: true,
        },
    );

    const roomLink = computed(() => {
        return `${useNuxtApp().$config.public.roomUrl}/${itemObject.value?.id}`;
    });

    const traitsSorted = computed(() => {
        return Object.entries(itemObject.value?.personalityTraits?.map || {}).toSorted((a, b) => {
            return IPersonalityTraitPriorityConfig[b[1].priority].sort - IPersonalityTraitPriorityConfig[a[1].priority].sort;
        });
    });

    const getTraitByID = (id: string) => {
        return personalityTraitsList.value?.items?.find((trait) => trait.id === id);
    };

    const getTraitResultByID = (id: string) => {
        return itemObject.value?.result?.traits?.[id];
    };

    const priorityMapBgColor = (priority: V1PersonalityTraitPriority): string | undefined => {
        switch (priority) {
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE:
                return '#8deb81';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_LOW:
                return '#3cbd73';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_MEDIUM:
                return '#afad00';
            case V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_HIGH:
                return '#f73131';
            default:
                return undefined;
        }
    };
</script>

<template>
    <div>
        <div class="form_title">
            <div class="title">Комната</div>
        </div>
        <div class="form-table mt-4">
            <div>
                <div class="title">ID:</div>
                <div class="value">
                    {{ itemObject?.id }}
                </div>
            </div>
            <div v-if="itemObject">
                <div class="title">Ссылка:</div>
                <div class="value">
                    <a
                        :href="roomLink"
                        target="_blank"
                        :class="$style.link"
                        >{{ roomLink }}</a
                    >
                </div>
            </div>
            <div v-if="itemObject">
                <div class="title">Профиль:</div>
                <div class="value">
                    <div>
                        <NuxtLink
                            :to="`/${module.urlName}/profiles/${itemObject.profile?.id}`"
                            :class="$style.link"
                            >{{ itemObject.profile?.name }}</NuxtLink
                        >
                    </div>
                    <div :class="$style.desc">Используются настройки профиля на момент создания комнаты</div>
                </div>
            </div>
            <div v-if="itemObject">
                <div class="title">Кандидат:</div>
                <div class="value">
                    <div>
                        <NuxtLink
                            :to="`/${crmModule.urlName}/candidates/${itemObject.candidate?.id}`"
                            :class="$style.link"
                            >{{ itemObject.candidate?.name }} {{ itemObject.candidate?.surname }}</NuxtLink
                        >
                    </div>
                </div>
            </div>
            <div v-if="itemObject">
                <div class="title">Статус:</div>
                <div class="value">
                    {{ IRoomStatusConfig[itemObject.status].label }}
                </div>
            </div>
        </div>
        <template v-if="itemObject?.result">
            <div class="form_title mt-10">
                <div class="title">Результат</div>
            </div>
            <div class="form-table mt-4">
                <div v-if="itemObject.resultIndex">
                    <div
                        class="title"
                        style="font-size: 18px"
                    >
                        Итоговый результат:
                    </div>
                    <div
                        class="value"
                        style="font-size: 18px"
                    >
                        <div>
                            <div>
                                Индекс соответствия: <b>{{ itemObject.resultIndex }}</b>
                            </div>
                        </div>
                        <div
                            v-if="
                                itemObject.result &&
                                itemObject.result.analyze &&
                                itemObject.result.analyze.hiringDecision !==
                                    V1TestingRoomResultAnalyzeHiringDecision.TESTING_ROOM_RESULT_ANALYZE_HIRING_DECISION_UNSPECIFIED
                            "
                        >
                            <b>{{ hiringDecisioToText(itemObject.result.analyze.hiringDecision) }}</b>
                            <div
                                v-if="itemObject.result.analyze.mainRecomendation"
                                style="margin-top: 20px; font-size: 16px"
                            >
                                {{ itemObject.result.analyze.mainRecomendation }}
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="itemObject.result && itemObject.result.analyze">
                    <div v-if="itemObject.result.analyze.personalityFit.keyMatches">
                        <div
                            class="title"
                            style="font-size: 16px"
                        >
                            Сильные стороны:
                        </div>
                        <div
                            class="value"
                            style="font-size: 14px"
                        >
                            <div>
                                <ul style="list-style: circle">
                                    <li
                                        v-for="item in itemObject.result.analyze.personalityFit.keyMatches"
                                        :key="item"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-if="itemObject.result.analyze.personalityFit.keyGaps">
                        <div
                            class="title"
                            style="font-size: 16px"
                        >
                            Слабые стороны:
                        </div>
                        <div
                            class="value"
                            style="font-size: 14px"
                        >
                            <div>
                                <ul style="list-style: circle">
                                    <li
                                        v-for="item in itemObject.result.analyze.personalityFit.keyGaps"
                                        :key="item"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-if="itemObject.result.analyze.risks?.length">
                        <div
                            class="title"
                            style="font-size: 16px"
                        >
                            Ключевые риски:
                        </div>
                        <div
                            class="value"
                            style="font-size: 14px"
                        >
                            <div>
                                <ul style="list-style: circle">
                                    <li
                                        v-for="item in itemObject.result.analyze.risks"
                                        :key="item"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div v-if="itemObject.result.analyze.actionItems?.length">
                        <div
                            class="title"
                            style="font-size: 16px"
                        >
                            Рекомендуемые действия:
                        </div>
                        <div
                            class="value"
                            style="font-size: 14px"
                        >
                            <div>
                                <ul style="list-style: circle">
                                    <li
                                        v-for="item in itemObject.result.analyze.actionItems"
                                        :key="item"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>
                <template
                    v-for="[traitID, traitConfig] in traitsSorted"
                    :key="traitID"
                >
                    <div v-if="getTraitByID(traitID)">
                        <div class="title">
                            {{ getTraitByID(traitID)?.name }}:
                            <div class="desc">
                                Приоритет:
                                <span
                                    style="text-transform: lowercase"
                                    :style="{ color: priorityMapBgColor(traitConfig.priority) }"
                                    >{{ IPersonalityTraitPriorityConfig[traitConfig.priority].label }}</span
                                >
                            </div>
                        </div>
                        <div class="value">
                            <div>
                                Совпадение: <b>{{ getTraitResultByID(traitID)?.match }}%</b>
                            </div>
                            <div :class="$style.result_desc">{{ getTraitResultByID(traitID)?.tip }}</div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .link {
        color: var(--ui-primary);
        text-decoration: underline;
    }

    .desc {
        font-size: 12px;
        color: var(--ui-color-graylight-500);
    }

    .result_desc {
        color: var(--ui-color-graylight-700);
    }
</style>
