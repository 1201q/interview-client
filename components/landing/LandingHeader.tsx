'use client';

import styles from './styles/header.module.css';
import Logo from '@/public/LOGO.svg';
import { useEffect, useState } from 'react';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
// Image

const LandingHeader = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <HeaderBlur>
      <div className={styles.headerWrapper}>
        <button
          className={styles.logoButton}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {/* <Logo /> */}
          {/* <Image
            src={'/main-logo.png'}
            alt="main-logo"
            width={29}
            height={20}
          /> */}
          <Logo width={70} height={40} />
        </button>
        {isLoggedIn ? (
          <>
            <div className={styles.rightController}>
              <Link href="/logout">
                <button className={styles.logoutButton}>
                  <span>로그아웃</span>
                </button>
              </Link>
              <Link href="/new-request">
                <button className={styles.mypageButton}>
                  <span>서비스로 이동</span>
                  <ChevronRightIcon size={16} />
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles.rightController}>
              <Link href="/login">
                <button className={styles.loginButton}>
                  <span>로그인</span> <ChevronRightIcon size={16} />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </HeaderBlur>
  );
};

function HeaderBlur({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();

    console.log(window.scrollY);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerBlur : ''}`}>
      {children}
    </header>
  );
}

export default LandingHeader;
