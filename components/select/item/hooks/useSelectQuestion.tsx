'use client';

import { selectedQuestionUUIDsAtom } from '@/store/select';
import { PrimitiveAtom } from 'jotai';
import { useAtom } from 'jotai';

export const useSelectQuestion = (
  atom: PrimitiveAtom<string[]> = selectedQuestionUUIDsAtom,
) => {
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(atom);

  const handleClick = (id: string) => {
    setSelectedQuestionUUIDs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((u) => u !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isSelected = (id: string) => {
    return selectedQuestionUUIDs.includes(id);
  };

  const selectedIndex = (id: string) => {
    return selectedQuestionUUIDs.indexOf(id);
  };

  return { handleClick, isSelected, selectedIndex };
};
