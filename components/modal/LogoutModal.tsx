'use client';

import styles from './styles/modal.module.css';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { motion } from 'motion/react';

const LogoutModal = ({
  email,
  action,
}: {
  email: string;
  action: () => Promise<void>;
}) => {
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
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  return (
    <div ref={bgRef} className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.padding}>
          <p className={styles.headerText}>정말 로그아웃하시겠어요?</p>
          <p className={styles.descText}>{email}</p>
          <p className={styles.descText}>계정에서 로그아웃합니다.</p>

          <div className={styles.buttonContainer}>
            <button
              className={styles.githubButton}
              onClick={async () => {
                await action();
                router.replace('/');
              }}
            >
              <span>로그아웃</span>
            </button>

            <button
              className={styles.googleButton}
              onClick={() => router.back()}
            >
              <span>취소</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
