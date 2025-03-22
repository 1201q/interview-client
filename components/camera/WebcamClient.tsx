'use client';

import styles from './styles/webcam.module.css';
import WebcamComponent from './Webcam';
import { initHumanAtom } from '@/store/webcam';
import { useSetAtom } from 'jotai';
const WebcamClient = () => {
  useSetAtom(initHumanAtom);

  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <WebcamComponent />
      </div>
    </div>
  );
};

export default WebcamClient;
