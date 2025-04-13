'use client';

import { UserQuestionType } from '@/utils/types/types';
import UserDeletedQuestionItem from '../../item/UserDeletedQuestionItem';

interface Props {
  initData: UserQuestionType[];
}

const UserDeletedQuestionListClient = ({ initData }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  const sortedData = initData.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <>
      {sortedData.map((answer) => (
        <UserDeletedQuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default UserDeletedQuestionListClient;
