import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import {
  AddQuestionType,
  HelpInformationType,
  QuestionType,
} from '@/utils/types/types';
import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

export const selectedQuestionsAtom = atom<QuestionType[]>([]);
export const setSelectedQuestionsAtom = atom(
  null,
  (get, set, update: QuestionType) => {
    const prev = get(selectedQuestionsAtom);

    const exists = prev.some((q) => q.id === update.id);

    if (exists) {
      set(
        selectedQuestionsAtom,
        prev.filter((q) => q.id !== update.id),
      );
    } else {
      if (prev.length < 15) {
        set(selectedQuestionsAtom, [...prev, update]);
      } else {
        alert('질문은 최대 15개까지만 선택할 수 있습니다.');
      }
    }
  },
);

export const deletedQuestionsAtom = atom<QuestionType[]>([]);

// selectedQuestionsAtom.onMount = (set) => {
//   return () => {
//     set([]);
//   };
// };

deletedQuestionsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

export const isUserPageOptionModalOpenAtom = atom(false);

const userPageOptionModeBaseAtom = atom<'delete' | null>(null);

export const userPageOptionModeAtom = atom(
  (get) => get(userPageOptionModeBaseAtom),
  (get, set, update: 'delete' | null) => {
    set(userPageOptionModeBaseAtom, update);
    set(isUserPageOptionModalOpenAtom, false);
  },
);

userPageOptionModeAtom.onMount = (set) => {
  return () => {
    set(null);
  };
};

isUserPageOptionModalOpenAtom.onMount = (set) => {
  return () => {
    set(false);
  };
};

export const addQuestionsAtom = atom<AddQuestionType[]>([
  { question_text: '', id: uuidv4() },
]);

addQuestionsAtom.onMount = (set) => {
  return () => {
    set([{ question_text: '', id: uuidv4() }]);
  };
};

export const helpInformationAtom = atom<HelpInformationType | null>(null);

helpInformationAtom.onMount = (set) => {
  return () => {
    set(null);
  };
};

export const searchInputAtom = atom<string>('');
