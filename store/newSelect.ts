import { atom } from 'jotai';
import { QuestionDataArray } from '@/utils/types/types';

export const userSelectedQuestionsAtom = atom<QuestionDataArray[]>([]);

export const setUserSelectedQuestionsAtom = atom(
  null,
  (get, set, update: QuestionDataArray) => {
    const prev = get(userSelectedQuestionsAtom);

    const exists = prev.some((q) => q.id === update.id);

    if (exists) {
      set(
        userSelectedQuestionsAtom,
        prev.filter((q) => q.id !== update.id),
      );
    } else {
      if (prev.length < 15) {
        set(userSelectedQuestionsAtom, [...prev, update]);
      } else {
        alert('질문은 최대 15개까지만 선택할 수 있습니다.');
      }
    }
  },
);

export const submitSelectedQuestionsAtom = atom((get) =>
  get(userSelectedQuestionsAtom).map((q, index) => {
    return { id: q.id, order: index };
  }),
);
