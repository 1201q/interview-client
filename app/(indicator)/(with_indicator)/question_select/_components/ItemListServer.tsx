import { ExtendedRoleType, QuestionType } from '@/utils/types/types';
import { cookies } from 'next/headers';
import { isRoleType } from '@/utils/types/guard';
import {
  getAiGeneratedQuestions,
  getBookmarkedQuestions,
  getQuestionListByRole,
  getUserCreatedQuestions,
} from '@/utils/services/question';
import ItemList from './ItemList';

interface Props {
  roleType: ExtendedRoleType;
}

const ItemListServer = async ({ roleType }: Props) => {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  const bookmarkData = isLoggedIn ? await getBookmarkedQuestions() : [];

  const getData = async (type: ExtendedRoleType): Promise<QuestionType[]> => {
    if (isRoleType(type)) {
      return getQuestionListByRole(type);
    } else if (type === 'user') {
      return getUserCreatedQuestions();
    } else if (type === 'ai') {
      return getAiGeneratedQuestions();
    } else if (type === 'bookmark') {
      const data = await getBookmarkedQuestions();
      const questions = data.map((item) => item.question);

      return questions;
    } else {
      return [];
    }
  };
  const data = await getData(roleType);

  return <ItemList data={data} bookmarkData={bookmarkData} />;
};

export default ItemListServer;
