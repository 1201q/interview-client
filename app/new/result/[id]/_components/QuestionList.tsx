'use client';

import { QuestionDataArray } from '@/utils/types/types';
import styles from './styles/question.list.module.css';
import QuestionItem from './QuestionItem';
import { useAtomValue } from 'jotai';
import { userSelectedQuestionsAtom } from '@/store/newSelect';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: QuestionDataArray[];
}

const QuestionList = ({ data }: Props) => {
  const selectedQuestions = useAtomValue(userSelectedQuestionsAtom);

  return (
    <div className={styles.container}>
      {data.length > 0 && (
        <div className={styles.gap}>
          <div className={styles.headerContainer}>
            <p>생성된 면접 질문</p>
          </div>
          <div className={styles.itemListContainer}>
            {data.map((item) => (
              <QuestionItem
                key={item.id}
                selected={
                  selectedQuestions.findIndex((d) => d.id === item.id) !== -1
                }
                data={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
