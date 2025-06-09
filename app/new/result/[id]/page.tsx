import { getGeneratedQuestions } from '@/utils/services/resume';
import styles from './page.module.css';
import NewHeader from '@/components/header/NewHeader';
import Header from '../../components/Header';
import QuestionList from './_components/QuestionList';
import Controller from './_components/Controller';

interface Props {
  params: Promise<{ id: string }>;
}

const ResultPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await getGeneratedQuestions(id);

  // http://localhost:3000/new/result/fec50ca2-2f95-47c5-81a3-9308b0a94767

  return (
    <div className={styles.container}>
      <NewHeader />
      <div className={styles.bgContainer}></div>
      <div className={styles.contents}>
        <Header />
        <div className={styles.listContainer}>
          <QuestionList data={data.questions} />
          <div className={styles.sideContainer}>
            <Controller />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
