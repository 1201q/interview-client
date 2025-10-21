'use client';

import styles from './styles/header.module.css';
import Logo from '@/public/aiterviewlogo-black.svg';
import { useEffect, useState } from 'react';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

const LandingHeader = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <HeaderBlur>
      <div className={styles.headerWrapper}>
        <Logo />
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
