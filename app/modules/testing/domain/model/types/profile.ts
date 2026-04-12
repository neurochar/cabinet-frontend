import { V1PersonalityTraitPriority, type V1TestingProfile } from '~/api/generated/Api';

export const IPersonalityTraitPriorityConfig: Record<V1PersonalityTraitPriority, { label: string; sort: number }> = {
    [V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_NONE]: { label: 'Не использовать', sort: 0 },
    [V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_LOW]: { label: 'Низкий', sort: 1 },
    [V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_MEDIUM]: { label: 'Средний', sort: 2 },
    [V1PersonalityTraitPriority.PRESONALITY_TRAIT_PRIORITY_HIGH]: { label: 'Высокий', sort: 3 },
};

export type IProfileItemState = Omit<Pick<V1TestingProfile, 'name' | 'description' | 'personalityTraits'>, 'personalityTraits'> &
    Required<Pick<V1TestingProfile, 'personalityTraits'>>;
