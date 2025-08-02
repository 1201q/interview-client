'use client';

import styles from './styles/container.module.css';
import sharedStyles from './styles/shared.module.css';
import checkStyles from './styles/check.module.css';
import useCreateQuestion from './hooks/useCreateQuestion';
import { AnimatePresence, Variants, motion } from 'motion/react';

import { Circle, Check, X } from 'lucide-react';
import Modal from './Modal';
import { useEffect, useRef, useState } from 'react';
import { useMediaPermissions } from './hooks/useMediaPermissions';

import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { VideoOff } from 'lucide-react';
import CameraCheck from './CameraCheck';

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
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const [isCameraOn, setIsCameraOn] = useState(false);

  const { cameraPermission, micPermission, requestPermission } =
    useMediaPermissions();

  const getStatusStyle = (permission: PermissionState) => {
    if (permission === 'granted') {
      return `${sharedStyles.status} ${sharedStyles.green}`;
    } else if (permission === 'denied') {
      return `${sharedStyles.status} ${sharedStyles.red}`;
    } else {
      return `${sharedStyles.status}`;
    }
  };

  const getPermissionIcon = (permission: PermissionState) => {
    if (permission === 'granted') {
      return <Check width={14} height={14} />;
    } else if (permission === 'denied') {
      return <X width={14} height={14} />;
    } else {
      return <Circle width={14} height={14} />;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      {/* left */}
      <div className={styles.leftContainer}>
        <motion.h1 variants={itemVariants}>면접 환경을 확인해주세요</motion.h1>
        <motion.p variants={itemVariants}>
          카메라와 마이크가 정상적으로 작동하는지 확인하고, 얼굴 인식과 음성
          인식을 테스트해보세요.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className={sharedStyles.interviewInfoContainer}
          style={{ margin: '10px 0' }}
        >
          <p>환경 체크 리스트</p>
          <div className={sharedStyles.interviewInfoItemContainer}>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={getStatusStyle(cameraPermission)}>
                {getPermissionIcon(cameraPermission)}
              </div>
              <span>카메라 연결</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={getStatusStyle(micPermission)}>
                {getPermissionIcon(micPermission)}
              </div>
              <span>마이크 연결</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={`${sharedStyles.status}`}>
                <Check width={14} height={14} />
              </div>
              <span>얼굴 인식</span>
            </div>
            <div className={sharedStyles.interviewInfoStatusItem}>
              <div className={`${sharedStyles.status}`}>
                <Check width={14} height={14} />
              </div>
              <span>음성 인식</span>
            </div>
          </div>
          <div
            className={`${styles.buttonContainer} ${sharedStyles.interviewButtonContainer}`}
          >
            <button onClick={requestPermission} disabled={true}>
              환경 체크를 완료해주세요
            </button>
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

      {/* right */}
      <div
        className={styles.rightContainer}
        style={{ justifyContent: 'flex-start' }}
      >
        <motion.div
          variants={itemVariants}
          className={checkStyles.listContainer}
        >
          <div className={checkStyles.title}>
            <p>1. 권한 요청/체크</p>
          </div>

          <div className={`${sharedStyles.tipContainer}`}>
            <div className={sharedStyles.header}>
              <h4>🛡️ 권한 요청</h4>
            </div>
            <ul>
              <li>
                해당 서비스는 카메라와 마이크 사용을 요구합니다. 브라우저에서
                카메라와 마이크 사용권한을 요청하면 &apos;허용&apos;을
                눌러주세요.
              </li>
            </ul>
          </div>
          <div
            className={`${styles.buttonContainer} ${styles.blue} ${sharedStyles.interviewButtonContainer}`}
          >
            <button onClick={requestPermission} disabled={false}>
              사용 권한 요청
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={checkStyles.listContainer}
        >
          <div className={checkStyles.title}>
            <p>2. 카메라 체크</p>
          </div>
          <motion.div className={sharedStyles.interviewInfoContainer}>
            <p>얼굴 인식</p>
            <CameraCheck cameraPermission={cameraPermission} />
          </motion.div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className={checkStyles.listContainer}
        >
          <div className={checkStyles.title}>
            <p>3. 마이크 체크</p>
          </div>
          <motion.div className={sharedStyles.interviewInfoContainer}>
            <p>목소리 인식</p>1
          </motion.div>
        </motion.div>
        <AnimatePresence mode="popLayout">
          {checkModalOpen && (
            <motion.div>
              <Modal onClose={() => setCheckModalOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {helpModalOpen && (
            <motion.div>
              <Modal
                onClose={() => setCheckModalOpen(false)}
                firstMenu="help"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckPage;
