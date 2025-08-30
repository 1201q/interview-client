'use client';
import { QUESTION_MOCK_DATA } from '@/utils/constants/question.mock';
import AnalyzeAnswerItem from './AnalyzeAnswerItem';
import styles from './styles/analyze.module.css';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import AnalyzeScore from './AnalyzeScore';
import AnalyzeWeakStrong from './AnalyzeWeakStrong';
import AnalyzeFace from './AnalyzeFace';
import AnalyzeVoice from './AnalyzeVoice';

const AnalyzePage = () => {
  const mock = useMemo(() => {
    return QUESTION_MOCK_DATA.slice(0, 5);
  }, []);

  return (
    <div className={styles.analyzeContainer}>
      <div className={styles.topTextContainer}>
        <p className={styles.titleText}>면접 결과</p>
        <p className={styles.mediumText}>
          AI가 분석한 당신의 면접 결과입니다. 강점을 확인하고 개선점을 참고하여
          더 나은 면접을 준비하세요.
        </p>
      </div>

      <div className={styles.analyzeTopContainer}>
        <AnalyzeScore />
        <AnalyzeWeakStrong type="strong" />
        <AnalyzeWeakStrong type="weak" />
      </div>
      <div className={styles.faceAndVoiceContainer}>
        <AnalyzeFace />
        <AnalyzeVoice />
      </div>
      <div className={styles.titleContainer}>
        <p className={styles.titleText}>질문별 상세 피드백</p>
      </div>
      <motion.div className={styles.AnswerFeedbackListContainer}>
        {mock.map((m, i) => (
          <AnalyzeAnswerItem key={m.id} order={i} text={m.text} />
        ))}
      </motion.div>
    </div>
  );
};

export default AnalyzePage;
