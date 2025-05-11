'use client';

import styles from '../page.module.css';
import SideMenu from './_components/SideMenu';

import Mic from '@/public/mic-svgrepo-white.svg';
import Webcam from '@/public/webcam-cam-white.svg';
import PermissionCheckPlz from './_components/PermissionCheckPlz';
import MicCheck from './_components/MicCheck';
import CameraCheck from './_components/CameraCheck';

import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import Loading from '@/components/common/Loading';

import { usePermissonCheck } from './_components/hooks/usePermissonCheck';

const STEP = [
  { name: '마이크 체크', icon: <Mic />, component: MicCheck },
  { name: '카메라 체크', icon: <Webcam />, component: CameraCheck },
];

const DeviceCheckPage = () => {
  const router = useRouter();

  const cameraPerm = usePermissonCheck('camera');
  const micPerm = usePermissonCheck('microphone');

  const isPermissionModalOpen =
    (cameraPerm !== null && !cameraPerm) || (micPerm !== null && !micPerm);

  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const CurrentComponent = STEP[stepIndex].component;

  const handleNextStep = () => {
    if (stepIndex === STEP.length - 1) {
      router.push('/interview');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStepIndex((prev) => prev + 1);
    }, 1200);
  };

  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.sideSelectContainer}>
          {STEP.map((step, i) => (
            <SideMenu
              key={step.name}
              text={step.name}
              icon={step.icon}
              isCompleted={stepIndex > i}
              isSelected={stepIndex === i}
            />
          ))}
        </div>
        <div className={styles.itemListContainer}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={stepIndex}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              style={{ position: 'relative' }}
            >
              <CurrentComponent handleNextStep={handleNextStep} />
              {loading && (
                <div className={styles.loadingContainer}>
                  <Loading size={50} color="black" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button className={styles.testButton} onClick={handleNextStep}>
          다음
        </button>
      </div>

      {isPermissionModalOpen && (
        <PermissionCheckPlz cameraPerm={cameraPerm} micPerm={micPerm} />
      )}
    </>
  );
};

export default DeviceCheckPage;
