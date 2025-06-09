'use client';

import styles from './page.module.css';
import NewHeader from '@/components/header/NewHeader';

import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import ProgressRing from './_components/ProgressRing';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import TextRender from './_components/TextRender';

const STEP = [
  { index: 1, name: '환영합니다' },
  { index: 2, name: '원을 표시' },
  { index: 3, name: '얼굴 인식 안내' },
  { index: 4, name: '얼굴 인식 시작' },
];

const CheckPage = () => {
  const [step, setStep] = useState(0);

  const [start, setStart] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!start) return;

    setProgress(0);
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      setProgress(currentStep / steps);
      if (currentStep >= steps) {
        clearInterval(timer);
        setProgress(1);
      }
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [start]);

  return (
    <div className={styles.container}>
      <NewHeader isBlack={true} />
      <WebcamInstance isRunning={false} />
      {step === 0 && <div className={styles.overlay}></div>}
      {step === 1 && <div className={styles.overlay}></div>}
      {step === 2 && (
        <div className={styles.overlayCircle}>
          <ProgressRing progress={progress} />
        </div>
      )}
      <AnimatePresence>
        <TextRender index={step} />
      </AnimatePresence>
      <button
        style={{ position: 'fixed', backgroundColor: 'white', zIndex: 1000 }}
        onClick={() => {
          setStart((prev) => !prev);
        }}
      >
        버튼
      </button>
      <button
        style={{
          position: 'fixed',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1000,
        }}
        onClick={() => {
          setStep((prev) => prev + 1);
        }}
      >
        다음 스텝
      </button>
    </div>
  );
};

export default CheckPage;
