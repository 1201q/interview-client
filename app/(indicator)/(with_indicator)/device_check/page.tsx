'use client';

import styles from '../page.module.css';
import SideMenu from './_components/SideMenu';

import Check from '@/public/check.svg';
import Mic from '@/public/mic-svgrepo-white.svg';
import Webcam from '@/public/webcam-cam-white.svg';
import PermissionCheckPlz from './_components/PermissionCheckPlz';
import MicCheck from './_components/MicCheck';
import CameraCheck from './_components/CameraCheck';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

const STEP = [
  { name: '권한 체크', icon: <Check />, component: PermissionCheckPlz },
  { name: '마이크 체크', icon: <Mic />, component: MicCheck },
  { name: '카메라 체크', icon: <Webcam />, component: CameraCheck },
];

const DeviceCheckPage = () => {
  const router = useRouter();
  const query = useSearchParams();

  const queryIndex = Number(query.get('step'));
  const stepIndex = isNaN(queryIndex)
    ? 0
    : Math.max(0, Math.min(queryIndex, STEP.length - 1));

  const CurrentComponent = STEP[stepIndex].component;

  const handleNextStep = () => {
    const next = stepIndex + 1;

    if (next < STEP.length) {
      router.push(`/device_check?step=${next}`);
    } else {
      console.log(1);
    }
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
            >
              <CurrentComponent handleNextStep={handleNextStep} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DeviceCheckPage;
