import { QSessionQuestionItem } from '@/utils/types/interview';
import { atom } from 'jotai';

export const InterviewJobRoleAtom = atom<string>();
export const KeywordsForSttAtom = atom<
  { id: string; stt_keywords: string[] }[]
>([]);

export const SessionQuestionsAtom = atom<QSessionQuestionItem[]>([]);
