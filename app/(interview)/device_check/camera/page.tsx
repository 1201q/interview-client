'use client';

import { useEffect, useState } from 'react';
import TopAlert from './_components/TopAlert';
import styles from './page.module.css';

import { initHumanAtom } from '@/store/webcam';
import { useSetAtom } from 'jotai';
import { detectionObserver } from '@/store/observer';
import Webcam from './_components/Webcam';

const CameraPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isCenter, setIsCenter] = useState(false);

  useSetAtom(initHumanAtom);

  useEffect(() => {
    const unsubscribe = detectionObserver.subscribe((data) => {
      console.log(data);
    });

    return () => unsubscribe();
  }, []);

  const setCenterStatus = (center: boolean) => {
    setIsCenter(center);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <TopAlert isCenter={isCenter} />
      </div>
      <div className={`${styles.contentsContainer}`}>
        <div className={`${isRunning ? styles.ready : styles.notReady}`}>
          <Webcam isRunning={isRunning} setCenterStatus={setCenterStatus} />
        </div>
      </div>
      <div
        className={styles.bottomContainer}
        style={{ height: `${isRunning ? '70px' : '200px'}` }}
      >
        <button
          onClick={() => {
            setIsRunning(true);
          }}
        >
          시작
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
          }}
        >
          종료
        </button>
      </div>
    </div>
  );
};

export default CameraPage;
