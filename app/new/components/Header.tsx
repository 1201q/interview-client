'use client';
import styles from './styles/header.module.css';
import { motion } from 'motion/react';

interface Props {
  title?: string;
  subTitle?: string;
}

const Header = ({
  title = '맞춤형 면접 질문 생성',
  subTitle = '이력서와 지원하려는 회사의 채용공고를 입력하면 AI가 맞춤형 면접 질문을 생성해드립니다.',
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.textContainer}>
        <p>{title}</p>
        <span>{subTitle}</span>
      </div>
    </motion.div>
  );
};

export default Header;
