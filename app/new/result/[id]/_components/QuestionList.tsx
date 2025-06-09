'use client';

import { QuestionDataArray } from '@/utils/types/types';
import styles from './styles/question.list.module.css';
import QuestionItem from './QuestionItem';
import { useAtomValue } from 'jotai';
import { userSelectedQuestionsAtom } from '@/store/newSelect';
import { motion } from 'motion/react';

interface Props {
  data: QuestionDataArray[];
}

const QuestionList = ({ data }: Props) => {
  const selectedQuestions = useAtomValue(userSelectedQuestionsAtom);

  return (
    <motion.div className={styles.container}>
      <div className={styles.headerContainer}>
        <p>생성된 면접 질문</p>
      </div>
      <div className={styles.itemListContainer}>
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10, y: index < 10 ? 10 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: index < 10 ? 0.4 : 0.2,
            }}
          >
            <QuestionItem
              selected={
                selectedQuestions.findIndex((d) => d.id === item.id) !== -1
              }
              data={item}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionList;
