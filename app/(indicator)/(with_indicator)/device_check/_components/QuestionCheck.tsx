'use client';

import PageHeader from './PageHeader';
import styles from './styles/question.check.module.css';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { selectedQuestionsAtom } from '@/store/select';
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

const QuestionCheck = ({ handleNextStep }: { handleNextStep: () => void }) => {
  const selectedQuestions = useAtomValue(selectedQuestionsAtom);

  const newSelectedQuestions = selectedQuestions.map((q, index) => {
    return { id: q.id, index: index + 1, text: q.question_text };
  });

  const [questions, setQuestions] = useState(newSelectedQuestions);

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
        index: index + 1,
      }),
    );

    setQuestions(newList);
  };

  return (
    <>
      <PageHeader
        titleText="질문 순서 확인"
        subtitleText="아이템을 드래그하여 질문 순서를 바꿀 수 있습니다."
      />
      <div className={styles.container}>
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
      </div>
    </>
  );
};

export default QuestionCheck;
