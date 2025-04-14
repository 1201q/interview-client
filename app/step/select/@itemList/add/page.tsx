'use client';
import AddQuestionClient from '@/components/select/container/AddQuestionClient';
import { addQuestionsAtom } from '@/store/select';
import { AddQuestionType } from '@/utils/types/types';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
  const [questions, setQuestions] = useAtom(addQuestionsAtom);
  return (
    <AddQuestionClient questions={questions} setQuestions={setQuestions} />
  );
};

export default Page;
