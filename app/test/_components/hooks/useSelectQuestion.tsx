'use client';

import { selectedQuestionsAtom } from '@/store/select';
import { QuestionType } from '@/utils/types/types';
import { PrimitiveAtom } from 'jotai';
import { useAtom } from 'jotai';

export const useSelectQuestion = (
  atom: PrimitiveAtom<QuestionType[]> = selectedQuestionsAtom,
) => {
  const [selectedQuestions, setSelectedQuestions] = useAtom(atom);

  const handleClick = (data: QuestionType) => {
    setSelectedQuestions((prev) => {
      const exists = prev.find((q) => q.id === data.id);

      if (exists) {
        return prev.filter((q) => q.id !== data.id);
      } else {
        return [...prev, data];
      }
    });
  };

  const isSelected = (id: string) => {
    return selectedQuestions.findIndex((data) => data.id === id) !== -1;
  };

  const selectedIndex = (id: string) => {
    return selectedQuestions.findIndex((data) => data.id === id);
  };

  return { handleClick, isSelected, selectedIndex };
};
