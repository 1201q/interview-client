import DeletableQuestionItem from '@/components/select/item/DeletableQuestionItem';
import ItemList from '@/components/select/ItemList';
import DeleteQuestionHeaderClient from '@/components/select/listHeader/DeleteQuestionHeader';
import ListLoader from '@/components/select/ListLoader';
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
      <Suspense fallback={<ListLoader />}>
        <ItemList
          data={data}
          renderItem={(item) => (
            <DeletableQuestionItem data={item} key={item.id} />
          )}
        />
      </Suspense>
    </>
  );
};

export default DeletePage;
