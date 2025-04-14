import styles from './_styles/page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';
import { RoleType } from '@/utils/types/types';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import QuestionListClient from '@/components/select/container/QuestionListClient';
import { getQuestionListByRole } from '@/utils/services/question';

interface Props {
  header: React.ReactNode;
  itemList: React.ReactNode;
  sidemenu: React.ReactNode;
}

const Layout = async () => {
  return <div className={styles.container}>1</div>;
};

export default Layout;
