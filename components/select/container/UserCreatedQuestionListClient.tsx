'use client';

import { UserQuestionType } from '@/utils/types/types';
import UserCreatedQuestionItem from '../item/UserCreatedQuestionItem';

interface Props {
  initData: UserQuestionType[];
}

const UserCreatedQuestionListClient = ({ initData }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  const sortedData = initData.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      {sortedData.map((answer) => (
        <UserCreatedQuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default UserCreatedQuestionListClient;
