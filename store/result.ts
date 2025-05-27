import { atom } from 'jotai';

import { InterviewSessionQuestionType } from '@/utils/types/types';

export const selectedAnswerAtom = atom<InterviewSessionQuestionType>();
