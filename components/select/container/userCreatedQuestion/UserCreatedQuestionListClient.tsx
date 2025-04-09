'use client';

import { UserQuestionType } from '@/utils/types/types';
import QuestionItem from '../../item/QuestionItem';

interface Props {
  initData: UserQuestionType[];
}

const UserCreatedQuestionListClient = ({ initData }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  return (
    <>
      {initData.map((answer) => (
        <QuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default UserCreatedQuestionListClient;
