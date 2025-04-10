'use client';

import { QuestionType } from '@/utils/types/types';
import QuestionItem from '../../item/QuestionItem';

interface Props {
  initData: QuestionType[];
  isLoggedIn: boolean;
}

const CategoryQuestionListClient = ({ initData, isLoggedIn }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  return (
    <>
      {initData.map((answer) => (
        <QuestionItem isLoggedIn={isLoggedIn} data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default CategoryQuestionListClient;
