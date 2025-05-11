'use client';

import Loading from '@/components/common/Loading';
import styles from './styles/camera.check.module.css';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import NewWebcam from '@/components/webcam/Webcam';
import Xmark from '@/public/xmark.svg';
import { useStableTrueCallback } from './hooks/useStableTrueCallback';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { cameraCheckCompletedAtom } from '@/store/step';

const CameraCheck = () => {
  const router = useRouter();

  const [init, setInit] = useState(false);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [isFaceCheckModalOpen, setIsFaceCheckModalOpen] = useState(false);

  const [completed, setCompleted] = useAtom(cameraCheckCompletedAtom);

  const [isFaceCenter, setIsFaceCenter] = useState(false);
  const [passed, setPassed] = useState(false);

  const setCenterStatus = (center: boolean) => {
    setIsFaceCenter(center);
  };

  const progress = useStableTrueCallback(
    isFaceCenter,
    5000,
    () => {
      console.log('✅ 얼굴이 5초 동안 정면 유지됨');
      setPassed(true);
    },
    isFaceCheckModalOpen,
  );

  useEffect(() => {
    if (passed) {
      setIsFaceCheckModalOpen(false);
      setCompleted(true);
    }
  }, [passed]);

  return (
    <motion.div
      className={`${!isFaceCheckModalOpen ? styles.container : styles.bgContainer}`}
    >
      {isFaceCheckModalOpen && (
        <button
          onClick={() => {
            setIsFaceCheckModalOpen(false);
          }}
          className={styles.cameraModalCloseButton}
        >
          <Xmark />
        </button>
      )}
      {isFaceCheckModalOpen && (
        <div
          className={`${styles.centerStatusContainer} ${isFaceCenter ? styles.blue : styles.red}`}
        >
          <p>
            {isFaceCenter
              ? (5 - progress / 20).toFixed(1)
              : '정면을 바라보세요'}
          </p>
        </div>
      )}
      <motion.div
        layoutId="camera"
        className={
          !isFaceCheckModalOpen
            ? styles.loadingContainer
            : styles.cameraModalContainer
        }
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <NewWebcam
          isRunning={isCameraRunning && isFaceCheckModalOpen}
          afterInit={() => {
            setInit(true);
            setIsCameraRunning(true);
          }}
          setCenterStatus={setCenterStatus}
        />

        {!init && <Loading size={40} color="white" />}
        {init && !isFaceCheckModalOpen && (
          <div
            onClick={() => {
              setPassed(false);
              setIsFaceCheckModalOpen(true);
            }}
            className={styles.cameraOverlayContainer}
          >
            <span>클릭하면 얼굴 감지로 이동합니다</span>
            <p>5초간 정면을 바라보세요</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CameraCheck;
