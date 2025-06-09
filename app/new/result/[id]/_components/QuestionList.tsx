'use client';

import { QuestionDataArray } from '@/utils/types/types';
import styles from './styles/question.list.module.css';
import QuestionItem from './QuestionItem';
import { useAtomValue } from 'jotai';
import { userSelectedQuestionsAtom } from '@/store/newSelect';

interface Props {
  data: QuestionDataArray[];
}

const QuestionList = ({ data }: Props) => {
  const selectedQuestions = useAtomValue(userSelectedQuestionsAtom);

  return (
    <div className={styles.container}>
      {selectedQuestions.length > 0 && (
        <div className={styles.gap}>
          <div className={styles.headerContainer}>
            <p>선택한 면접 질문</p>
          </div>
          <div className={styles.itemListContainer}>
            {selectedQuestions.map((item) => (
              <QuestionItem
                selected={
                  selectedQuestions.findIndex((q) => q.id === item.id) !== -1
                }
                key={item.id}
                data={item}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.headerContainer}>
        <p>생성된 면접 질문</p>
      </div>
      <div className={styles.itemListContainer}>
        {data
          .filter(
            (item) =>
              selectedQuestions.findIndex((q) => q.id === item.id) === -1,
          )
          .map((item) => (
            <QuestionItem selected={false} key={item.id} data={item} />
          ))}
      </div>
    </div>
  );
};

export default QuestionList;
