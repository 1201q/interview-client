'use client';

import { useRef, useState } from 'react';
import styles from './styles/webcam.module.css';
import WebcamComponent from './Webcam';
import useSize from '@/hooks/useSize';

const WebcamClient = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { size, isResizing } = useSize(
    containerRef as React.RefObject<HTMLElement>,
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {!isResizing && <WebcamComponent size={size} />}
      {size.width} /{size.height}
    </div>
  );
};

export default WebcamClient;
