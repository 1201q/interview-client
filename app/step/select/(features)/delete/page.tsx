import UserDeletedQuestionItem from '@/components/select/item/UserDeletedQuestionItem';
import ItemList from '@/components/select/ItemList';
import DeleteQuestionHeaderClient from '@/components/select/listHeader/DeleteQuestionHeader';
import { getUserCreatedQuestions } from '@/utils/services/question';
import { Suspense } from 'react';

const DeletePage = async () => {
  const data = await getUserCreatedQuestions();

  if (data.length === 0) {
    return <div>없음.</div>;
  }

  return (
    <>
      <DeleteQuestionHeaderClient />
      <Suspense fallback={<div>로딩중....</div>}>
        <ItemList
          data={data}
          renderItem={(item) => (
            <UserDeletedQuestionItem data={item} key={item.id} />
          )}
        />
      </Suspense>
    </>
  );
};

export default DeletePage;
