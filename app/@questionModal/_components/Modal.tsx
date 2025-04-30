'use client';

import styles from '../_styles/modal.module.css';
import Xmark from '@/public/xmark.svg';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

interface Props {
  titleText?: string;
  introduceText?: string;
  children: React.ReactNode;
}

const Modal = ({ titleText, introduceText, children }: Props) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      router.back();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleBackgroundClick);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.container} ref={bgRef}>
      <motion.div
        initial={{ y: 40, scale: 1, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className={styles.modalContainer}
      >
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <p className={styles.titleText}>{titleText}</p>
            <span>{introduceText}</span>
          </div>
          <button
            onClick={() => {
              router.back();
            }}
          >
            <Xmark />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
