'use client';

import { InterviewSessionQuestionType } from '@/utils/types/types';
import styles from './styles/answerlist.module.css';
import { useAtom } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import { useHydrateAtoms } from 'jotai/utils';

interface Props {
  data: InterviewSessionQuestionType[];
}

const AnswerList = ({ data }: Props) => {
  useHydrateAtoms([[selectedAnswerAtom, data[0]]]);

  const [selected, setSelected] = useAtom(selectedAnswerAtom);

  return (
    <div className={styles.container}>
      {data.map((q) => (
        <div
          className={`${styles.item} ${selected && selected.id === q.id ? styles.select : ''}`}
          key={q.id}
          onClick={() => {
            setSelected(q);
          }}
        >
          <p>질문 {q.order + 1}</p>
          <span>{q.question.question_text}</span>
        </div>
      ))}
    </div>
  );
};

export default AnswerList;
