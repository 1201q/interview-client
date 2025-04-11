import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import { atom } from 'jotai';

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

export const isUserPageOptionModalOpenAtom = atom(false);

const userPageOptionModeBaseAtom = atom<'delete' | 'modify' | null>(null);

export const userPageOptionModeAtom = atom(
  (get) => get(userPageOptionModeBaseAtom),
  (get, set, update: 'delete' | 'modify' | null) => {
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
