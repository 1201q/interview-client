'use client';

import { FileText, Briefcase, Brain, Sparkles } from 'lucide-react';
import styles from './styles/container.module.css';
import loadingStyles from './styles/loading.module.css';

import { Timer, ZapIcon } from 'lucide-react';

import { motion, Variants } from 'motion/react';
import { useEffect, useState } from 'react';

import { GeneratedQuestionItem } from '@/utils/types/types';
import { v4 as uuid } from 'uuid';
import LoadingQuestionList from './LoadingQuestionList';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { stiffness: 80, type: 'spring' },
  },
};

const LoadingPage = (props: LoadingPageProps) => {
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestionItem[]
  >([]);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'fail' | 'success'>(
    'loading',
  );

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-question/test/${TEST_ID}?mock=false`,
    );

    eventSource.addEventListener('question', (e) => {
      const q = JSON.parse(e.data);
      setGeneratedQuestions((prev) => [...prev, { ...q, id: uuid() }]);
    });

    eventSource.addEventListener('done', () => {
      console.log('DONE');
      setStatus('success');

      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.log('EventSource failed:', error);

      setStatus('fail');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (generatedQuestions.length > 0) {
      const goal = 20;
      const questions = generatedQuestions.length;

      setProgress(questions * (100 / goal));
    }
  }, [generatedQuestions]);

  useEffect(() => {
    if (status === 'success') {
      props.onLoadingComplete();
    }
  }, [props, status]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={loadingStyles.loadingContainer}
        >
          {/* 상단 로딩 원 */}
          <motion.div
            variants={itemVariants}
            className={loadingStyles.loadingCircleContainer}
          >
            <div className={loadingStyles.loadingCircle}>
              <motion.div
                className={loadingStyles.rotatingCircle}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <ZapIcon color="white" />
              </motion.div>
            </div>
            {[FileText, Briefcase, Brain, Sparkles].map((Icon, index) => (
              <motion.div
                key={index}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  position: 'absolute',
                }}
                animate={{
                  rotate: 360,
                  x: Math.cos((index * Math.PI) / 2) * 80,
                  y: Math.sin((index * Math.PI) / 2) * 80,
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                  delay: index * 0.5,
                }}
              >
                <div className={loadingStyles.circleItem}>
                  <Icon />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 그라디언트 텍스트 */}
          <motion.div
            variants={itemVariants}
            className={loadingStyles.loadingContentsContainer}
          >
            <h3 className={loadingStyles.gradientText}>
              AI가 면접 질문을 생성하고 있어요
            </h3>
          </motion.div>

          {/* 안내 텍스트  */}
          <motion.div
            variants={itemVariants}
            className={loadingStyles.loadingContentsContainer}
          >
            <p>
              이력서와 채용공고를 꼼꼼히 분석하여 맞춤형 면접 질문을 만들고
              있어요. 조금만 기다려 주세요.
            </p>
          </motion.div>

          {/* 프로그레스 바 */}
          <motion.div
            variants={itemVariants}
            className={loadingStyles.loadingContentsContainer}
          >
            <div className={loadingStyles.progressbarContainer}>
              <div className={loadingStyles.progressbarHeaderContainer}>
                <span>진행률</span>
                <span>{progress}%</span>
              </div>
              <div className={loadingStyles.progressbar}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={loadingStyles.bar}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* 남은 시간 */}
          <motion.div
            variants={itemVariants}
            className={loadingStyles.loadingContentsContainer}
          >
            <div className={loadingStyles.timeLeftContainer}>
              <Timer width={14} height={14} />
              <p>예상 분석시간 : 30초 ~ 1분</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className={styles.rightContainer}>
        <LoadingQuestionList questions={generatedQuestions} />
      </div>
    </div>
  );
};

export default LoadingPage;
