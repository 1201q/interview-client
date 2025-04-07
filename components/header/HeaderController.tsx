'use client';

import { useRouter } from 'next/navigation';
import styles from './styles/landngHeader.module.css';
import Image from 'next/image';
import Github from '@/public/github.svg';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  logout: () => Promise<void>;
  token: string | undefined;
}

const HeaderController = ({ logout, token }: Props) => {
  const router = useRouter();
  const [showLoginButtons, setShowLoginButtons] = useState(false);

  if (!token) {
    return (
      <div className={styles.controllerContainer}>
        {showLoginButtons && (
          <div className={`${styles.socialButtonContainer} `}>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <button className={styles.socialButton}>
                <Image
                  src={'/google-logo.png'}
                  alt="구글로고"
                  width={25}
                  height={25}
                />
              </button>
            </Link>
            <button className={styles.socialButton}>
              <Github />
            </button>
          </div>
        )}

        <Link href={'/login'}>
          <button className={styles.loginButton}>로그인</button>
        </Link>
      </div>
    );
  }

  return (
    <form
      action={() => {
        logout();
        router.refresh();
      }}
    >
      <button type="submit" className={styles.loginButton}>
        로그아웃
      </button>
    </form>
  );
};

export default HeaderController;
