'use client';

import { QuestionType } from '@/utils/types/types';
import QuestionItem from '../item/QuestionItem';
import UserFavoritableQuestionItem from '../item/UserFavoritableQuestionItem';

interface Props {
  initData: QuestionType[];
  isLoggedIn: boolean;
}

const QuestionListClient = ({ initData, isLoggedIn }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  if (isLoggedIn) {
    return (
      <>
        {initData.map((answer) => (
          <UserFavoritableQuestionItem data={answer} key={answer.id} />
        ))}
      </>
    );
  }

  return (
    <>
      {initData.map((answer) => (
        <QuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default QuestionListClient;
