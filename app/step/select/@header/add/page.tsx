import styles from './questionListHeader.module.css';
import OpenAi from '@/public/openai.svg';
import Link from 'next/link';
import Plus from '@/public/plus.svg';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';
import AddQuestionHeaderClient from '@/components/select/listHeader/AddQuestionHeaderClient';

const HeaderPage = async () => {
  return <AddQuestionHeaderClient />;
};

export default HeaderPage;
