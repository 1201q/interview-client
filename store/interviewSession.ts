import {
  InterviewInitStatus,
  QSessionQuestionItem,
} from '@/utils/types/interview';
import { atom } from 'jotai';

export const InterviewInitAtom = atom<InterviewInitStatus>('beforeInit');

export const InterviewJobRoleAtom = atom<string | undefined>();
export const KeywordsForSttAtom = atom<
  { id: string; stt_keywords: string[] }[]
>([]);

export const SessionQuestionsAtom = atom<QSessionQuestionItem[]>([]);

InterviewInitAtom.onMount = (set) => {
  return () => {
    console.log('InterviewInitAtom unmount');
    set('beforeInit');
  };
};
