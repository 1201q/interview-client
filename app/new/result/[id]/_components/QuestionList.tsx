'use client';

import { QuestionData, QuestionSection } from '@/utils/types/types';
import styles from './styles/question.list.module.css';
import QuestionItem from './QuestionItem';
import { useAtomValue } from 'jotai';
import { userSelectedQuestionsAtom } from '@/store/newSelect';

interface Props {
  data: Record<QuestionSection, QuestionData[]>;
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
            {selectedQuestions.map((item, index) => (
              <QuestionItem
                selected={
                  selectedQuestions.findIndex(
                    (q) => q.question === item.question,
                  ) !== -1
                }
                key={`${item.question}-${index}`}
                {...item}
              />
            ))}
          </div>
        </div>
      )}
      <div className={styles.headerContainer}>
        <p>생성된 면접 질문</p>
      </div>
      <div className={styles.itemListContainer}>
        {Object.entries(data)
          .flatMap(([section, questions]) =>
            questions.map(({ question, based_on }) => ({
              section,
              question,
              based_on,
            })),
          )
          .filter(
            (item) =>
              selectedQuestions.findIndex(
                (q) => q.question === item.question,
              ) === -1,
          )
          .map((item, index) => (
            <QuestionItem
              selected={false}
              key={`${item.question}-${index}`}
              {...item}
            />
          ))}
      </div>
    </div>
  );
};

export default QuestionList;
