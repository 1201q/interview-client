'use client';

import styles from './styles/container.module.css';
import sharedStyles from './styles/shared.module.css';
import useCreateQuestion from './hooks/useCreateQuestion';
import { AnimatePresence, Variants, motion } from 'motion/react';

import { Circle, Check } from 'lucide-react';
import Modal from './Modal';
import { useState } from 'react';

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { stiffness: 80, type: 'spring' } },
};

const CheckPage = ({
  props,
}: {
  props: ReturnType<typeof useCreateQuestion>;
}) => {
  const [checkModalOpen, setCheckModalOpen] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <div className={styles.leftContainer}>
        <motion.h1 variants={itemVariants}>면접 환경을 확인해주세요</motion.h1>
        <motion.p variants={itemVariants}>
          카메라와 마이크가 정상적으로 작동하는지 확인하고, 얼굴 인식과 음성
          인식을 테스트해보세요.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className={sharedStyles.interviewInfoContainer}
        >
          <p>환경 체크 리스트</p>
          <div className={sharedStyles.interviewInfoItemContainer}>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={sharedStyles.status}>
                <Circle width={14} height={14} />
              </div>
              <span>카메라 연결</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={sharedStyles.status}>
                <Circle width={14} height={14} />
              </div>
              <span>마이크 연결</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={sharedStyles.status}>
                <Check width={14} height={14} />
              </div>
              <span>얼굴 인식</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={`${sharedStyles.status} ${sharedStyles.green}`}>
                <Check width={14} height={14} />
              </div>
              <span>음성 인식</span>
            </div>
          </div>
          <div
            className={`${styles.buttonContainer} ${sharedStyles.interviewButtonContainer}`}
          >
            <button disabled={false}>환경 체크를 완료해주세요</button>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={sharedStyles.tipContainer}
        >
          <div className={sharedStyles.header}>
            <h4>💡 환경 설정 팁</h4>
          </div>
          <ul>
            <li>• 조용한 환경에서 진행해주세요</li>
            <li>• 얼굴이 잘 보이도록 조명을 확인해주세요</li>
            <li>• &quot;안녕하세요&quot;를 명확하게 발음해주세요</li>
          </ul>
        </motion.div>
      </div>
      <div
        className={styles.rightContainer}
        style={{ justifyContent: 'flex-start' }}
      >
        <motion.div
          variants={itemVariants}
          className={sharedStyles.interviewInfoContainer}
        >
          <p>카메라 미리보기</p>
          <div className={sharedStyles.interviewInfoItemContainer}>1</div>
          <div
            className={`${styles.buttonContainer} ${sharedStyles.interviewButtonContainer}`}
          >
            <button onClick={() => setCheckModalOpen(true)} disabled={false}>
              환경 체크를 완료해주세요
            </button>
          </div>
        </motion.div>
        <AnimatePresence mode="popLayout">
          {checkModalOpen && (
            <motion.div>
              <Modal onClose={() => setCheckModalOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckPage;
