'use client';

import styles from './styles/resume.loading.module.css';
import Lottie from 'react-lottie-player';
import loadingJson from '@/public/loading.json';
import Clock from '@/public/clock-regular.svg';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const textArray = [
  { index: 0, text: '이력서를 체크하는 중이에요' },
  { index: 1, text: '채용공고를 확인하는 중이에요' },
  { index: 2, text: '질문을 생성하는 중이에요' },
];

const ResumeLoading = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (textIndex >= 2) return;

    const timer = setTimeout(
      () => {
        setTextIndex((prev) => prev + 1);
      },
      (textIndex + 1) * 3000,
    );

    return () => clearTimeout(timer);
  }, [textIndex]);

  return (
    <div className={styles.container}>
      <Lottie
        animationData={loadingJson}
        play
        style={{ width: 400, height: 400 }}
      />
      <div className={styles.textContainer}>
        {textIndex === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.remainingTime}
          >
            <Clock /> <span>예상 30초</span>
          </motion.div>
        )}
        {textIndex === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {textArray[0].text}
          </motion.p>
        )}
        {textIndex === 1 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {textArray[1].text}
          </motion.p>
        )}
        {textIndex === 2 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {textArray[2].text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default ResumeLoading;
