'use client';

import { useEffect, useState } from 'react';
import styles from './styles/webcam.module.css';
import WebcamComponent from './Webcam';
import { initHumanAtom } from '@/store/webcam';
import { useSetAtom } from 'jotai';
import { Result } from '@vladmandic/human';
import { detectionObserver } from '@/store/observer';
const WebcamClient = () => {
  useSetAtom(initHumanAtom);

  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const unsubscribe = detectionObserver.subscribe((data) => {
      console.log(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <WebcamComponent />
      </div>
    </div>
  );
};

export default WebcamClient;
