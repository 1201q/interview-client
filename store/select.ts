import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import { atom } from 'jotai';

type RoleOptionType = (typeof ROLE_OPTIONS)[number];

export const selectedRoleAtom = atom<RoleOptionType>(ROLE_OPTIONS[0]);

export const selectedQuestionUUIDsAtom = atom<string[]>([]);

selectedQuestionUUIDsAtom.onMount = (set) => {
  return () => {
    set([]);
  };
};

export const isUserAddButtonSelectedAtom = atom(false);
