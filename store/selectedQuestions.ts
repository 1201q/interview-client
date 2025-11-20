import { GeneratedQuestionItem } from '@/utils/types/types';
import { atom } from 'jotai';

export const selectedQuestionsAtom = atom<GeneratedQuestionItem[]>([]);

selectedQuestionsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

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

export const selectedQuestionIdSetAtom = atom(
  (get) => new Set(get(selectedQuestionsAtom).map((q) => q.id)),
);
