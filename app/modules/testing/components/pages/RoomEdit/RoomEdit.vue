<script setup lang="ts">
    import { showErrors } from '~/core/components/shared/inform/toast';
    import { module as crmModule } from '~/modules/crm/const';
    import { module } from '~/modules/testing/const';
    import { setModuleBreadcrums } from '~/modules/testing/domain/actions/setModuleBreadcrums';
    import { fetchRoom } from '~/modules/testing/domain/api/room/fetchRoom';
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

    const isLoadingAnything = computed(() => isLoading.value);

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
</style>
