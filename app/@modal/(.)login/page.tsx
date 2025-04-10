'use client';

import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import Github from '@/public/github.svg';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

const LoginModal = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      router.back();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleBackgroundClick);
    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  return (
    <div ref={bgRef} className={styles.container}>
      <motion.div
        className={styles.loginBox}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.13, ease: 'easeInOut' }}
      >
        <section className={styles.leftSection}></section>
        <section>
          <div className={styles.padding}>
            <p className={styles.headerText}>로그인</p>
            <p className={styles.mediumText}>소셜 계정 로그인</p>
            <div className={styles.buttonContainer}>
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                <button className={styles.githubButton}>
                  <Github />
                  <span>Github 로그인</span>
                </button>
              </Link>
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                <button className={styles.googleButton}>
                  <Image
                    src={'/google-logo.png'}
                    alt="구글로고"
                    width={26}
                    height={26}
                  />
                  <span>구글 로그인</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default LoginModal;
