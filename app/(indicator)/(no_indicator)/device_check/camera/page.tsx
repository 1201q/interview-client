'use client';

import { useEffect, useState } from 'react';
import TopAlert from './_components/TopAlert';
import styles from './page.module.css';

import { initHumanAtom } from '@/store/webcam';
import { useSetAtom } from 'jotai';
import { detectionObserver } from '@/store/observer';
import Webcam from './_components/Webcam';
import BottomQuestion from './_components/BottomQuestion';
import Controller from './_components/Controller';

const CameraPage = () => {
  const [isRunning, setIsRunning] = useState(false);

  const [init, setInit] = useState(false);
  const [isCenter, setIsCenter] = useState(false);

  const [recognizing, setRecognizing] = useState(false);

  // useSetAtom(initHumanAtom);

  useEffect(() => {
    const unsubscribe = detectionObserver.subscribe((data) => {
      console.log(data);
    });

    return () => unsubscribe();
  }, []);

  const setCenterStatus = (center: boolean) => {
    setIsCenter(center);
  };

  const start = () => {
    setIsRunning(true);
    setTimeout(() => {
      setRecognizing(true);
    }, 500);
  };

  const stop = () => {
    setRecognizing(false);
    setIsRunning(false);
  };

  const afterInit = () => {
    setInit(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        {recognizing && <TopAlert isCenter={isCenter} />}
      </div>
      <div className={`${styles.contentsContainer}`}>
        <div className={`${isRunning ? styles.ready : styles.notReady}`}>
          <Webcam
            afterInit={afterInit}
            isRunning={isRunning}
            setCenterStatus={setCenterStatus}
            size="fill"
          />
        </div>
      </div>
      <BottomQuestion />
      <div className={styles.bottomContainer}>
        <Controller isRunning={isRunning} start={start} stop={stop} />
      </div>
    </div>
  );
};

export default CameraPage;
