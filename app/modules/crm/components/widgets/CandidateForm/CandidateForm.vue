<script setup lang="ts">
    import { CalendarDate } from '@internationalized/date';
    import { computed, nextTick, ref, useTemplateRef } from 'vue';
    import type { V1Candidate } from '~/api/generated/Api';
    import type { UploadedFile } from '~/core/components/shared/FileUploader/model/types/types';
    import { CRM_CANDIDATE_RESUME_FILE_TARGET } from '~/modules/crm/domain/model/const/const';
    import { ICandidateItemGenderConfig, type CandidateFromState } from '~/modules/crm/domain/model/types/candidate';

    const props = defineProps<{
        disabled?: boolean;
        mode: 'new' | 'edit';
    }>();

    const dataModel = defineModel<CandidateFromState>({ required: true });
    const dataItem = defineModel<V1Candidate | null>('dataItem', { required: true });

    const inputDate = useTemplateRef('inputDate');
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
            value: key,
            label: value.label,
        }));
    });

    const birthday = computed<CalendarDate | null>({
        get() {
            const v = dataModel.value.birthday;
            if (!v) return null;

            return new CalendarDate(v.year, v.month, v.day);
        },
        set(val) {
            if (!val) {
                dataModel.value.birthday = undefined;
                return;
            }

            dataModel.value.birthday = {
                year: val.year,
                month: val.month,
                day: val.day,
            };
        },
    });

    const clearBirthday = () => {
        birthday.value = null;
    };

    const onUpdateFile = (files: UploadedFile[]) => {
        if (files.length === 0) {
            dataModel.value.resumeFile = undefined;
            return;
        }

        const file = files[0]!;
        dataModel.value.resumeFile = file.targets[CRM_CANDIDATE_RESUME_FILE_TARGET]!;
    };
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
                    v-model="dataModel.name"
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
                    v-model="dataModel.surname"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                />
            </div>
        </div>

        <div>
            <div class="title">
                Пол:
                <div class="desc">Указывать необязательно, но знание поможет нашим алгоритмам точнее работать с карточкой кандидата</div>
            </div>
            <div class="value">
                <USelect
                    v-model="dataModel.gender"
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
                <div class="desc">Указывать необязательно, но знание поможет нашим алгоритмам точнее работать с карточкой кандидата</div>
            </div>
            <div class="value">
                <UInputDate
                    ref="inputDate"
                    v-model="birthday"
                    size="xl"
                    class="w-full"
                    :disabled="disabled"
                >
                    <template #trailing>
                        <div class="flex items-center gap-1">
                            <UButton
                                v-if="birthday && !disabled"
                                color="neutral"
                                variant="link"
                                size="sm"
                                icon="i-lucide-circle-x"
                                aria-label="Очистить дату"
                                class="px-0"
                                @click.stop="clearBirthday"
                            />

                            <UPopover :reference="inputDate?.inputsRef?.[3]?.$el">
                                <UButton
                                    color="neutral"
                                    variant="link"
                                    size="sm"
                                    icon="i-lucide-calendar"
                                    aria-label="Выбрать дату"
                                    class="px-0"
                                    :disabled="disabled"
                                />

                                <template #content>
                                    <UCalendar
                                        v-model="birthday"
                                        class="p-2"
                                    />
                                </template>
                            </UPopover>
                        </div>
                    </template>
                </UInputDate>
            </div>
        </div>

        <div>
            <div class="title">
                Резюме:
                <div class="desc">Указывать необязательно, но резюме поможет нашим алгоритмам точнее работать с карточкой кандидата</div>
            </div>
            <div class="value">
                <SharedFileUploader
                    :disabled="disabled"
                    :lead-target="CRM_CANDIDATE_RESUME_FILE_TARGET"
                    mode="solo"
                    upload-url="/v1/crm/candidates-resume"
                    accept-types="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    :model-value="
                        dataModel.resumeFile
                            ? [
                                  {
                                      targets: {
                                          [CRM_CANDIDATE_RESUME_FILE_TARGET]: dataModel.resumeFile,
                                      },
                                  },
                              ]
                            : []
                    "
                    @update:model-value="onUpdateFile"
                />
            </div>
        </div>
    </div>
</template>
