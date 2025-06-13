import {
  InterviewClientStatusType,
  QuestionSection,
} from '@/utils/types/types';
import { atom } from 'jotai';

export const interviewClientStatusAtom =
  atom<InterviewClientStatusType>('pending');

interviewClientStatusAtom.onMount = (set) => {
  return () => {
    set('pending');
  };
};
export const interviewSessionIdAtom = atom<string>();
export const totalQuestionsAtom = atom<number>();

type CurrentQuestionType = {
  question_id: string;
  question_text: string;
  question_order: number;
  section: QuestionSection;
};

export const currentQuestionAtom = atom<CurrentQuestionType>();
