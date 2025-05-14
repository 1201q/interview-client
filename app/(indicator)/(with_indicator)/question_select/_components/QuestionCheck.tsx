'use client';

import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  finalSelectedQuestionsAtom,
  selectedQuestionsAtom,
} from '@/store/select';
import DraggableQuestionItem from './DraggableQuestionItem';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const QuestionCheck = () => {
  const selectedQuestions = useAtomValue(selectedQuestionsAtom);

  const newSelectedQuestions = selectedQuestions.map((q, index) => {
    return { id: q.id, index, text: q.question_text };
  });

  const [questions, setQuestions] = useAtom(finalSelectedQuestionsAtom);

  useEffect(() => {
    setQuestions(newSelectedQuestions);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newList = arrayMove(questions, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        index: index,
      }),
    );

    setQuestions(newList);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((item) => (
            <DraggableQuestionItem
              key={item.id}
              id={item.id}
              index={item.index}
              text={item.text}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

export default QuestionCheck;
