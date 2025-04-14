import styles from '../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/Sidebar';
import { Suspense } from 'react';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';
import UserCreatedQuestionListClient from '@/components/select/container/UserCreatedQuestionListClient';
import { getUserCreatedQuestions } from '@/utils/services/question';

const Page = async () => {
  const data = await getUserCreatedQuestions();

  return <UserCreatedQuestionListClient initData={data} />;
};

export default Page;
