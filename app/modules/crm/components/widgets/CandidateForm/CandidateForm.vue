<script setup lang="ts">
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

    const birthday = computed<string | null>({
        get() {
            const v = dataModel.value.birthday;
            if (!v) {
                return null;
            }
            const mm = String(v.month).padStart(2, '0');
            const dd = String(v.day).padStart(2, '0');

            return `${mm}.${dd}.${v.year}`;
        },
        set(val) {
            if (!val) {
                dataModel.value.birthday = undefined;
                return;
            }

            const d = new Date(val);

            dataModel.value.birthday = {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                day: d.getDate(),
            };
        },
    });

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
                <SharedDatetimePicker
                    v-model="birthday"
                    size="xl"
                />
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

<style lang="less" module>
    @import '@styles/includes';

    .linksBlockTitle {
        font-size: 20px;
        margin-bottom: 20px;
    }
</style>
