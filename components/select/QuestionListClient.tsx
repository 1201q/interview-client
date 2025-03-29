import { QuestionType } from '@/utils/types/types';
import styles from './styles/questionList.module.css';

interface Props {
  initData: QuestionType[];
}

const QuestionListClient = ({ initData }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

  return (
    <>
      {initData.map((answer) => (
        <div key={answer.id} className={styles.answer}>
          {answer.question_text}
        </div>
      ))}
    </>
  );
};

export default QuestionListClient;
