<script setup lang="ts">
    import type { InputMenuItem } from '@nuxt/ui';
    import type { V1TestingListProfile, V1TestingProfile } from '~/api/generated/Api';
    import { ApiError } from '~/shared/errors/errors';
    import { declOfNum } from '~/shared/helpers/functions';

    const api = useApi();

    const vModel = defineModel<string | null>({ default: null });

    const props = defineProps<{
        disabled?: boolean;
        size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs';
    }>();

    const localValue = ref<string | null>(vModel.value);

    const menuValue = ref<InputMenuItem | null>(null);

    watch(menuValue, (item) => {
        const next = typeof item === 'object' && item && item.value ? item : null;
        const nextValue = next?.value || null;

        if (nextValue === localValue.value) return;

        localValue.value = nextValue;
        vModel.value = nextValue;
    });

    const searchTerm = ref('');
    const searchTermDebounced = refDebounced(searchTerm, 200);

    const items = ref<InputMenuItem[]>([]);

    const isLoadingItems = ref(false);

    const isLoadingItem = ref(false);

    const isLoading = computed(() => isLoadingItems.value || isLoadingItem.value);

    let listController: AbortController | null = null;

    const itemToInputMenuItem = (item: V1TestingProfile | V1TestingListProfile): InputMenuItem => {
        return {
            label: item.name,
            value: item.id,
        };
    };

    const fetchData = async () => {
        isLoadingItems.value = true;

        try {
            if (listController) {
                listController.abort();
            }

            listController = new AbortController();

            const res = await api.v1.testingPublicServiceListProfiles(
                {
                    searchQuery: searchTerm.value,
                    limit: String(100),
                },
                {
                    signal: listController.signal,
                },
            );

            if (res.error !== null) {
                throw res.error;
            }

            if (res.data?.items) {
                items.value = res.data.items.map(itemToInputMenuItem);
            }
        } catch (e: unknown) {
            console.error(e);
        } finally {
            isLoadingItems.value = false;
        }
    };

    watch(searchTermDebounced, () => {
        fetchData();
    });

    const clear = () => {
        localValue.value = null;
        vModel.value = null;
        menuValue.value = null;
        searchTerm.value = '';
    };

    let itemController: AbortController | null = null;

    const selectItem = async (value: string | null) => {
        if (!value) {
            clear();
            return;
        }

        isLoadingItem.value = true;

        try {
            if (itemController) {
                itemController.abort();
            }

            itemController = new AbortController();

            const res = await api.v1.testingPublicServiceGetProfile(value, {
                signal: itemController.signal,
            });

            if (res.error !== null) {
                throw res.error;
            }

            if (res.data?.item) {
                menuValue.value = itemToInputMenuItem(res.data.item);
            }
        } catch (e: unknown) {
            console.error(e);
            if (e instanceof ApiError) {
                if (e.code === 404) {
                    menuValue.value = null;
                }
            }
        } finally {
            isLoadingItem.value = false;
        }
    };

    onMounted(async () => {
        fetchData();

        if (vModel.value) {
            await selectItem(vModel.value);
        }
    });

    watch(
        () => vModel.value,
        (newVal) => {
            if (newVal === localValue.value) return;

            localValue.value = newVal;

            selectItem(newVal);
        },
        { immediate: true },
    );

    const isOpened = ref(false);

    const onOpen = (value: boolean) => {
        isOpened.value = value;

        if (!value) return;

        searchTerm.value = menuValue.value && typeof menuValue.value === 'object' && menuValue.value.label ? menuValue.value.label : '';
    };
</script>

<template>
    <div :class="$style.wrapper">
        <div :class="$style.input">
            <UInputMenu
                v-model="menuValue"
                v-model:search-term="searchTerm"
                :disabled="disabled"
                :items="items"
                :loading="isLoading"
                icon="i-lucide-user-pen"
                placeholder="Выберите профиль..."
                ignore-filter
                :size="size"
                class="w-full"
                @update:open="onOpen"
            >
                <template #item="{ item }">
                    <div
                        v-if="item && typeof item === 'object'"
                        :class="$style.item"
                    >
                        <div :class="$style.id">{{ item.value }}</div>
                        <div :class="$style.name">{{ item.label }}</div>
                    </div>
                </template>
                <template #content-bottom>
                    <template v-if="searchTerm.length && items.length">
                        <div :class="$style.contentBottom">
                            {{ declOfNum(items.length, ['Найден', 'Найдено', 'Найдено']) }} {{ items.length }}
                            {{ declOfNum(items.length, ['объект', 'объекта', 'объектов']) }} по запросу "{{ searchTerm }}"
                        </div></template
                    >
                </template>
            </UInputMenu>
        </div>
        <div :class="$style.clear">
            <UButton
                type="button"
                icon="i-lucide-circle-x"
                :size="size"
                variant="ghost"
                title="Очистить"
                :disabled="disabled"
                @click="clear"
            />
        </div>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';

    .wrapper {
        display: flex;
        gap: 1px;

        > .input {
            width: 100%;
        }

        > .clear {
            flex-shrink: 0;
        }
    }

    .item {
        > .id {
            font-size: 11px;
            color: var(--ui-color-graylight-500);
        }
    }

    .contentBottom {
        padding: 10px 10px;
        font-size: 12px;
        color: var(--ui-color-graylight-700);
        text-align: center;
    }
</style>
