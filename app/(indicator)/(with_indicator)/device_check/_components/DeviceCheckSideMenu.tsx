'use client';

import { usePathname } from 'next/navigation';
import styles from './styles/sidemenu.module.css';
import Check from '@/public/check.svg';

import Mic from '@/public/mic-svgrepo-white.svg';
import Webcam from '@/public/webcam-cam-white.svg';
import { useAtomValue } from 'jotai';
import { cameraCheckCompletedAtom, micCheckCompletedAtom } from '@/store/step';

interface ItemProps {
  text: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  icon: any;
}

const STEP = [
  { name: '마이크 체크', icon: <Mic />, code: '/device_check/mic' },
  { name: '카메라 체크', icon: <Webcam />, code: '/device_check/camera' },
];

const DeviceCheckSideMenu = () => {
  const pathname = usePathname();
  const currentStepIndex = STEP.findIndex((step) =>
    step.code.includes(pathname),
  );

  const micCheck = useAtomValue(micCheckCompletedAtom);
  const cameraCheck = useAtomValue(cameraCheckCompletedAtom);

  return (
    <>
      {STEP.map((step, index) => (
        <DeviceCheckSideMenuItem
          key={step.name}
          text={step.name}
          icon={step.icon}
          isCompleted={
            step.code === '/device_check/mic' ? micCheck : cameraCheck
          }
          isSelected={currentStepIndex === index}
        />
      ))}
    </>
  );
};

const DeviceCheckSideMenuItem = ({
  text,
  isCompleted,
  isSelected,
  icon,
}: ItemProps) => {
  return (
    <div
      className={`${styles.container} ${`${isCompleted ? styles.isCompleted : isSelected ? styles.isSelected : ''}`}`}
    >
      <span className={`${styles.boxContainer} `}>
        {isCompleted && <Check />}
        {!isCompleted && !isSelected && <Check />}
        {!isCompleted && isSelected && icon}
      </span>
      <p>{text}</p>
    </div>
  );
};

export default DeviceCheckSideMenu;
