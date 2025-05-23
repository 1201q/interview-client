import { atom } from 'jotai';
import { interviewSessionAtom } from './interview';
import { InterviewSessionQuestionType } from '@/utils/types/types';

export const selectedAnswerAtom = atom<InterviewSessionQuestionType>();
