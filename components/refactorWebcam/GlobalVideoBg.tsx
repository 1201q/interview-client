'use client';
import { webcamStreamAtom } from '@/store/webcam';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './webcam.module.css';

const GlobalVideoBg = () => {
  const stream = useAtomValue(webcamStreamAtom);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;
    ref.current.play().then(() => {
      if (ref.current) {
        ref.current.pause();
      }
    });
  }, [stream]);

  return createPortal(
    <video
      ref={ref}
      className={styles.bgVideoFixed}
      muted
      playsInline
      aria-hidden
    />,
    document.body,
  );
};

export default GlobalVideoBg;
