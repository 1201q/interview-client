import styles from './questionListHeader.module.css';
import OpenAi from '@/public/openai.svg';
import Link from 'next/link';
import Plus from '@/public/plus.svg';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';

const HeaderPage = async () => {
  return <QuestionListHeaderServer />;
};

export default HeaderPage;
