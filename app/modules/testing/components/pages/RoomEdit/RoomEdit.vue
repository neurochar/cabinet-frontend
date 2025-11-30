<script setup lang="ts">
    import { showErrors } from '~/core/components/shared/inform/toast';
    import { module as crmModule } from '~/modules/crm/const';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { loadPersonalityTraitsList } from '~/modules/testing/domain/api/personality_trait/fetchPersonalityTraitsList';
    import { fetchRoom } from '~/modules/testing/domain/api/room/fetchRoom';
    import { priorityToConfig } from '~/modules/testing/domain/model/types/profile';
    import { statusToConfig, type IRoomItem } from '~/modules/testing/domain/model/types/room';
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

    const itemObject = ref<IRoomItem | null>(null);

    const isLoading = ref(false);

    const errors = ref<string[]>([]);

    const { data: personalityTraitsList } = loadPersonalityTraitsList();

    const isLoadingAnything = computed(() => isLoading.value || !personalityTraitsList.value);

    const fetchItem = async (): Promise<IRoomItem | null> => {
        isLoading.value = true;
        try {
            const data = await fetchRoom(props.id);
            return data;
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

    const updateItemState = (item: IRoomItem) => {
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
        return Object.entries(itemObject.value?.personalityTraitsMap || []).toSorted((a, b) => {
            return b[1].priority - a[1].priority;
        });
    });

    const getTraitByID = (id: number) => {
        return personalityTraitsList.value?.items.find((trait) => trait.ID === id);
    };

    const getTraitResultByID = (id: string) => {
        return itemObject.value?.result?.traits[id];
    };

    const priorityMapBgColor = (priority: number): string | undefined => {
        switch (priority) {
            case 0:
                return '#8deb81';
            case 1:
                return '#3cbd73';
            case 2:
                return '#afad00';
            case 3:
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
                            >{{ itemObject.candidate?.candidateName }} {{ itemObject.candidate?.candidateSurname }}</NuxtLink
                        >
                    </div>
                </div>
            </div>
            <div v-if="itemObject">
                <div class="title">Статус:</div>
                <div class="value">
                    {{ statusToConfig(itemObject.status)?.label }}
                </div>
            </div>
        </div>
        <template v-if="itemObject?.result">
            <div class="form_title mt-10">
                <div class="title">Результат</div>
            </div>
            <div class="form-table mt-4">
                <div>
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
                            Совпадение: <b>{{ itemObject.result.totalMatch }}%</b>
                        </div>
                        <div :class="$style.result_desc">{{ itemObject.result.totalMatchTip }}</div>
                    </div>
                </div>
                <template
                    v-for="[traitID, traitConfig] in traitsSorted"
                    :key="traitID"
                >
                    <div v-if="getTraitByID(Number(traitID))">
                        <div class="title">
                            {{ getTraitByID(Number(traitID))?.Name }}:
                            <div class="desc">
                                Приоритет:
                                <span
                                    style="text-transform: lowercase"
                                    :style="{ color: priorityMapBgColor(traitConfig.priority) }"
                                    >{{ priorityToConfig(traitConfig.priority)?.label }}</span
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
