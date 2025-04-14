'use client';

import { v4 as uuidv4 } from 'uuid';
import AddQuestionHeader from '@/components/select/listHeader/AddQuestionHeader';
import { useAtom } from 'jotai';
import { addQuestionsAtom } from '@/store/select';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { createUserQuestions } from '@/utils/actions/createUserQuestions';
import AddQuestionList from '@/components/select/AddQuestionList';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

const Page = () => {
  const [questions, setQuestions] = useAtom(addQuestionsAtom);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submitQuestions: SubmitQuestions[] = questions.map((q) => {
      return { question_text: q.question_text, role: 'user' };
    });

    try {
      createUserQuestions(submitQuestions);
      setQuestions([{ question_text: '', id: uuidv4() }]);

      alert('질문 추가 성공! 질문 목록에서 확인해보세요.');

      router.refresh();
    } catch (error) {
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AddQuestionHeader />
      <AddQuestionList />
    </form>
  );
};

export default Page;
