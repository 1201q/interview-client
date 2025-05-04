'use client';

import Loading from '@/components/common/Loading';
import PageHeader from './PageHeader';
import styles from './styles/camera.check.module.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import NewWebcam from '@/components/webcam/Webcam';

const CameraCheck = () => {
  const [init, setInit] = useState(false);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [isFaceCheckModalOpen, setIsFaceCheckModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        titleText="카메라 체크"
        subtitleText="카메라가 얼굴을 제대로 인식하는지 확인하는 단계에요. 로딩이 완료되면 정면을 3초동안 바라보세요."
      />

      <motion.div
        className={`${!isFaceCheckModalOpen ? styles.container : styles.bgContainer}`}
      >
        <motion.div
          layoutId="camera"
          className={
            !isFaceCheckModalOpen
              ? styles.loadingContainer
              : styles.cameraModalContainer
          }
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <Loading size={40} color="white" />
          <NewWebcam
            isRunning={isCameraRunning}
            afterInit={() => {
              setInit(true);
              setIsCameraRunning(true);
            }}
          />
          {init && !isFaceCheckModalOpen && (
            <div
              onClick={() => setIsFaceCheckModalOpen(true)}
              className={styles.cameraOverlayContainer}
            >
              <span>클릭하면 얼굴 감지로 이동합니다</span>
              <p>5초간 정면을 바라보세요</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default CameraCheck;
