'use client';

import { UserQuestionType } from '@/utils/types/types';

import UserCreatedQuestionItem from '../../item/UserCreatedQuestionItem';

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
        <UserCreatedQuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default UserCreatedQuestionListClient;
