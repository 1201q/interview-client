'use client';

import { QuestionSection } from '@/utils/types/types';
import styles from './styles/question.item.module.css';

import Timer from '@/public/clock.svg';
import { useSetAtom } from 'jotai';
import { setUserSelectedQuestionsAtom } from '@/store/newSelect';
import React from 'react';

interface Props {
  based_on: string;
  question: string;
  section: string;
  selected: boolean;
}

const QuestionItem = (props: Props) => {
  const setSelected = useSetAtom(setUserSelectedQuestionsAtom);

  const section = props.section as QuestionSection;

  const resume = props.based_on.includes('이력서');
  const recruitment =
    props.based_on.includes('채용') && props.based_on.includes('공고');

  return (
    <div
      onClick={() =>
        setSelected({
          question: props.question,
          section: section,
          based_on: props.based_on,
        })
      }
      className={`${styles.container} ${props.selected ? styles.selected : ''}`}
    >
      <div className={styles.leftContainer}></div>
      <div className={styles.rightContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.statusContainer}>
            {section === 'basic' && <div className={styles.status}>기본</div>}
            {section === 'experience' && (
              <div className={styles.status}>경험</div>
            )}
            {section === 'job_related' && (
              <div className={styles.status}>직무</div>
            )}
            {section === 'expertise' && (
              <div className={styles.status}>전문지식</div>
            )}
            {resume && (
              <div className={`${styles.status} ${styles.green}`}>이력서</div>
            )}
            {recruitment && (
              <div className={`${styles.status} ${styles.violet}`}>
                채용공고
              </div>
            )}
          </div>
          <div className={styles.timeContainer}>
            <Timer />
            {section === 'basic' && <p>1분</p>}
            {section === 'experience' && <p>2분</p>}
            {section === 'job_related' && <p>1분 30초</p>}
            {section === 'expertise' && <p>1분 30초</p>}
          </div>
        </div>
        <div className={styles.textContainer}>
          <p>{props.question}</p> <span>{props.based_on}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuestionItem);
