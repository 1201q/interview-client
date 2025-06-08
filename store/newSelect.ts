import { atom } from 'jotai';
import { QuestionDataArray } from '@/utils/types/types';

export const userSelectedQuestionsAtom = atom<QuestionDataArray[]>([]);

export const setUserSelectedQuestionsAtom = atom(
  null,
  (get, set, update: QuestionDataArray) => {
    const prev = get(userSelectedQuestionsAtom);

    const exists = prev.some((q) => q.question === update.question);

    if (exists) {
      console.log('삭제');
      set(
        userSelectedQuestionsAtom,
        prev.filter((q) => q.question !== update.question),
      );
    } else {
      if (prev.length < 15) {
        console.log('추가');
        set(userSelectedQuestionsAtom, [...prev, update]);
      } else {
        alert('질문은 최대 15개까지만 선택할 수 있습니다.');
      }
    }
  },
);
