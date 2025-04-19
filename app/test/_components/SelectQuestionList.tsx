'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/side.info.module.css';
import Xmark from '@/public/xmark.svg';
import { selectedQuestionsAtom } from '@/store/select';
import { QuestionType } from '@/utils/types/types';
import { useSelectQuestion } from './hooks/useSelectQuestion';

interface ItemProps {
  data: QuestionType;
  index: number;
}

const SelectQuestionList = () => {
  const selectedQuestions = useAtomValue(selectedQuestionsAtom);

  return (
    <>
      {selectedQuestions.length !== 0 && (
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <p className={styles.titleText}>선택한 질문</p>
          </div>
          <div className={styles.list}>
            {selectedQuestions.map((q, index) => (
              <Item data={q} key={q.id} index={index} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const Item = ({ data, index }: ItemProps) => {
  const { handleClick } = useSelectQuestion();

  return (
    <div className={styles.item}>
      <p>
        {`${index + 1}. `}
        {data.question_text}
      </p>
      <button onClick={() => handleClick(data)}>
        <Xmark />
      </button>
    </div>
  );
};

export default SelectQuestionList;
