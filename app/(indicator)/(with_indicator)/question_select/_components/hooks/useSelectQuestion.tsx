'use client';

import {
  selectedQuestionsAtom,
  setSelectedQuestionsAtom,
} from '@/store/select';
import { QuestionType } from '@/utils/types/types';
import { useAtomValue, useSetAtom } from 'jotai';

export const useSelectQuestion = () => {
  const selectedQuestions = useAtomValue(selectedQuestionsAtom);
  const setSelectedQuestions = useSetAtom(setSelectedQuestionsAtom);

  const handleClick = (data: QuestionType) => {
    setSelectedQuestions(data);
  };

  const isSelected = (id: string) => {
    return selectedQuestions.findIndex((data) => data.id === id) !== -1;
  };

  const selectedIndex = (id: string) => {
    return selectedQuestions.findIndex((data) => data.id === id);
  };

  return { handleClick, isSelected, selectedIndex };
};
