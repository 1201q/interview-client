'use client';

import styles from './styles/modal.module.css';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';

import Logo from '@/public/aiterviewlogo.svg';

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
      <div className={styles.loginBox}>
        <div className={styles.padding}>
          <div className={styles.headerLogo}>
            <Logo />
          </div>
          <p className={styles.loginHeaderText}>서비스에 로그인하고</p>
          <p className={styles.loginHeaderText}>다양한 기능을 사용하세요.</p>
          <div className={styles.divider}>
            <span>소셜 로그인</span>
          </div>
          <div className={styles.loginButtonContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <button className={styles.googleButton}>
                <Image
                  src={'/google-logo.png'}
                  alt="구글로고"
                  width={20}
                  height={20}
                />
                <span>Google로 계속하기</span>
              </button>
            </Link>
          </div>

          <div className={styles.cancel}>
            <button
              className={styles.cancel}
              onClick={() => {
                router.back();
              }}
            >
              <span>로그아웃 유지</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
