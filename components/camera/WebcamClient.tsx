'use client';

import { useRef } from 'react';
import styles from './styles/webcam.module.css';
import WebcamComponent from './Webcam';
import useSize from '@/utils/hooks/useSize';
import InitHuman from './InitHuman';

const WebcamClient = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { size, isResizing } = useSize(
    containerRef as React.RefObject<HTMLElement>,
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.webcamContainer}>
        <WebcamComponent />
      </div>
      <InitHuman />
    </div>
  );
};

export default WebcamClient;
