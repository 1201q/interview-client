'use client';

import Plus from '@/public/plus.svg';
import styles from './styles/questionListHeader.module.css';
import { useAtom } from 'jotai';
import { isUserAddButtonSelectedAtom } from '@/store/select';

const QuestionListHeaderClient = () => {
  const [selected, setSelected] = useAtom(isUserAddButtonSelectedAtom);

  return (
    <button
      onClick={() => {
        setSelected((prev) => !prev);
      }}
      className={`${styles.button} ${selected ? styles.selected : ''}`}
    >
      <Plus />
      <p>직접추가</p>
    </button>
  );
};

export default QuestionListHeaderClient;
