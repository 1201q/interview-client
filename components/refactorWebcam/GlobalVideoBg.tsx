'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

import { webcamStreamAtom } from '@/store/webcam';
import styles from './webcam.module.css';

const GlobalVideoBg = () => {
  const stream = useAtomValue(webcamStreamAtom);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !stream) return;
    ref.current.srcObject = stream;

    ref.current
      .play()
      .then(() => {
        ref.current?.pause();
      })
      .catch(() => {});
  }, [stream]);

  return (
    <video
      ref={ref}
      className={styles.bgVideoFixed}
      muted
      playsInline
      aria-hidden
    />
  );
};

export default GlobalVideoBg;
