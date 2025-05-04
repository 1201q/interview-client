'use client';

import styles from '../page.module.css';
import SideMenu from './_components/SideMenu';

import { useState } from 'react';

import Mic from '@/public/mic-svgrepo-white.svg';
import Webcam from '@/public/webcam-cam-white.svg';
import PermissionCheckPlz from './_components/PermissionCheckPlz';
import MicCheck from './_components/MicCheck';
import CameraCheck from './_components/CameraCheck';

const STEP = [
  { name: '카메라 체크', code: 'check_camera' },
  { name: '마이크 체크', code: 'check_mic' },
  { name: '다음 단계', code: 'next' },
];

const DeviceCheckPage = () => {
  const [currentStep, setCurrentStep] = useState(STEP[0].code);

  const handleCompleted = (nextCode: string) => {
    setCurrentStep(nextCode);
  };

  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.sideSelectContainer}>
          <SideMenu
            text={STEP[0].name}
            icon={<Webcam />}
            isCompleted={currentStep === 'check_mic'}
            isSelected={currentStep === 'check_camera'}
          />
          <SideMenu
            text={STEP[1].name}
            icon={<Mic />}
            isCompleted={currentStep === 'next'}
            isSelected={currentStep === 'check_mic'}
          />
        </div>
        <div className={styles.itemListContainer}>
          {/* <PermissionCheckPlz /> */}
          {/* <MicCheck /> */}
          <CameraCheck />
        </div>
      </div>
    </>
  );
};

export default DeviceCheckPage;
