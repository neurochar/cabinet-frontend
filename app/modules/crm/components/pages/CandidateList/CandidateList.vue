<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    import Confirm from '~/core/components/shared/Confirm/modals/Confirm.vue';
    import { showErrors, showSuccess } from '~/core/components/shared/inform/toast';
    import { module } from '~/modules/crm/const';
    import { setModuleBreadcrums } from '~/modules/crm/domain/actions/setModuleBreadcrums';
    import { deleteCandidate } from '~/modules/crm/domain/api/candidate/deleteCandidate';
    import { fetchCandidateList } from '~/modules/crm/domain/api/candidate/fetchCandidateList';
    import { ICandidateItemGender, ICandidateItemGenderConfig, type ICandidateListItem } from '~/modules/crm/domain/model/types/candidate';
    import { setMenu } from '~/plugins/app/model/actions/setMenu';
    import { ApiError } from '~/shared/errors/errors';
    import { calcAge, declOfNum, parseDate } from '~/shared/helpers/functions';

    useSeoMeta({
        title: 'База кандидатов',
    });

    setMenu(module.urlName, 'candidates');

    setModuleBreadcrums([
        {
            name: 'База кандидатов',
        },
    ]);

    const isLoading = ref(true);

    const list = ref<ICandidateListItem[]>([]);

    const listPrepared = computed(() => {
        return list.value;
    });

    const fetchData = async () => {
        isLoading.value = true;

        try {
            const data = await fetchCandidateList();
            if (data.items) {
                list.value = data.items;
            }
        } catch (e: unknown) {
            if (e instanceof ApiError) {
                showErrors(e.formHints());
            }
        } finally {
            isLoading.value = false;
        }
    };

    const removeItem = async (id: string): Promise<boolean> => {
        const modal = useOverlay().create(Confirm, {
            props: {
                text: 'Вы действительно хотите удалить объект?',
            },
            destroyOnClose: true,
        });

        const instance = modal.open();

        const shouldDelete = await instance.result;
        if (shouldDelete) {
            try {
                await deleteCandidate(id);

                showSuccess('Объект удален');

                return true;
            } catch (e) {
                if (e instanceof ApiError) {
                    showErrors(e.formHints());
                }
            }
        }

        return false;
    };

    const columns: TableColumn<ICandidateListItem>[] = [
        {
            id: 'id',
            header: 'ID',
        },
        {
            id: 'name',
            header: 'Имя',
        },
        {
            id: 'action',
        },
    ];

    function getDropdownActions(item: ICandidateListItem): DropdownMenuItem[][] {
        return [
            [
                {
                    label: 'Редактировать',
                    icon: 'i-lucide-edit',
                    to: `/${module.urlName}/candidates/${item.id}`,
                },
                {
                    label: 'Удалить',
                    icon: 'i-lucide-trash',
                    color: 'error',
                    onSelect: async () => {
                        const result = await removeItem(item.id);
                        if (result) {
                            list.value = list.value.filter((p) => p.id !== item.id);
                        }
                    },
                },
            ],
        ];
    }

    const columnPinning = ref({ left: [], right: ['action'] });

    onMounted(() => {
        fetchData();
    });
</script>

<template>
    <div>
        <div class="flex justify-end">
            <UButton :to="`/${module.urlName}/candidates/new`">Создать новый объект</UButton>
        </div>
        <UTable
            v-model:column-pinning="columnPinning"
            :data="listPrepared"
            :columns="columns"
            :loading="isLoading"
            :ui="{ td: '__whitespace-normal' }"
        >
            <template #id-cell="{ row }">
                <div style="font-size: 10px">{{ row.original.id }}</div>
            </template>
            <template #name-cell="{ row }">
                <div style="font-weight: bold">{{ row.original.candidateName }} {{ row.original.candidateSurname }}</div>
                <template v-if="row.original.candidateGender != ICandidateItemGender.unknown">
                    <div style="font-size: 11px">Пол: {{ ICandidateItemGenderConfig[row.original.candidateGender].label }}</div>
                </template>
                <template v-if="row.original.candidateBirthday != null">
                    <div style="font-size: 11px">
                        Дата рождения: {{ parseDate(row.original.candidateBirthday).toLocaleDateString() }},
                        {{ calcAge(parseDate(row.original.candidateBirthday)) }}
                        {{ declOfNum(calcAge(parseDate(row.original.candidateBirthday)), ['год', 'года', 'лет']) }}
                    </div>
                </template>
            </template>
            <template #action-cell="{ row }">
                <div class="flex justify-end">
                    <UDropdownMenu :items="getDropdownActions(row.original)">
                        <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                            aria-label="Действия"
                        />
                    </UDropdownMenu>
                </div>
            </template>
        </UTable>
    </div>
</template>

<style lang="less" module>
    @import '@styles/includes';
</style>
