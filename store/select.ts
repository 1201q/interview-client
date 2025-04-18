import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import {
  AddQuestionType,
  HelpInformationType,
  QuestionType,
} from '@/utils/types/types';
import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';

type RoleOptionType = (typeof ROLE_OPTIONS)[number];

export const selectedRoleAtom = atom<RoleOptionType>(ROLE_OPTIONS[0]);

export const selectedQuestionUUIDsAtom = atom<string[]>([]);
export const deletedQuestionUUIDsAtom = atom<string[]>([]);

selectedQuestionUUIDsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

deletedQuestionUUIDsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

export const selectedQuestionsAtom = atom<QuestionType[]>([]);
export const deletedQuestionsAtom = atom<QuestionType[]>([]);

selectedQuestionsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

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
