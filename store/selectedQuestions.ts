import { GeneratedQuestionItem, QuestionSection } from '@/utils/types/types';
import { atom } from 'jotai';

export const DURATION_BY_SECTION: Record<QuestionSection, number> = {
  basic: 60,
  experience: 120,
  job_related: 90,
  expertise: 90,
};

export const selectedQuestionsAtom = atom<GeneratedQuestionItem[]>([]);

export const toggleSelectedQuestionsAtom = atom(
  null,
  (get, set, item: GeneratedQuestionItem) => {
    const prev = get(selectedQuestionsAtom);

    const exists = prev.some((sq) => sq.id === item.id);

    set(
      selectedQuestionsAtom,
      exists ? prev.filter((q) => q.id !== item.id) : [...prev, item],
    );
  },
);

export const clearSelectedQuestionsAtom = atom(null, (_get, set) => {
  set(selectedQuestionsAtom, []);
});

export const selectedQuestionsCountAtom = atom(
  (get) => get(selectedQuestionsAtom).length,
);

export const selectedQuestionIdSetAtom = atom(
  (get) => new Set(get(selectedQuestionsAtom).map((q) => q.id)),
);

export const selectedTotalSecondsAtom = atom((get) => {
  const selected = get(selectedQuestionsAtom);

  return selected.reduce((sum, q) => sum + DURATION_BY_SECTION[q.section], 0);
});
