'use client';

import { UserQuestionType } from '@/utils/types/types';
import UserCreatedQuestionItem from '../../item/UserCreatedQuestionItem';
import { useAtomValue } from 'jotai';
import { userPageOptionModeAtom } from '@/store/select';
import UserDeletedQuestionItem from '../../item/UserDeletedQuestionItem';

interface Props {
  initData: UserQuestionType[];
}

const UserCreatedQuestionListClient = ({ initData }: Props) => {
  const optionMode = useAtomValue(userPageOptionModeAtom);

  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  const sortedData = initData.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (optionMode === 'delete') {
    return (
      <>
        {sortedData.map((answer) => (
          <UserDeletedQuestionItem data={answer} key={answer.id} />
        ))}
      </>
    );
  }

  return (
    <>
      {sortedData.map((answer) => (
        <UserCreatedQuestionItem data={answer} key={answer.id} />
      ))}
    </>
  );
};

export default UserCreatedQuestionListClient;
