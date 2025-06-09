import styles from './styles/text.module.css';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  index: number;
}

const STEP = [
  { index: 1, name: '환영합니다' },
  { index: 2, name: '원을 표시' },
  { index: 3, name: '얼굴 인식 안내' },
  { index: 4, name: '얼굴 인식 시작' },
];

const TextRender = ({ index }: Props) => {
  if (index === 1) {
    return (
      <motion.div className={styles.welcomeTextContainer}>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          카메라와 마이크 환경을
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        >
          체크하는 단계에요
        </motion.p>
      </motion.div>
    );
  } else if (index === 2) {
    return (
      <motion.div className={styles.textContainer}>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          카메라와 마이크 환경을
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        >
          체크하는 단계에요
        </motion.p>
      </motion.div>
    );
  }

  return <></>;
};

export default TextRender;
