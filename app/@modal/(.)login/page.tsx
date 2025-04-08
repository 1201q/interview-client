'use client';

import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import Github from '@/public/github.svg';

const LoginModal = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
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
      </div>
    </div>
  );
};

export default LoginModal;
