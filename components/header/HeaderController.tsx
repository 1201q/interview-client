'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './styles/landngHeader.module.css';

interface Props {
  logout: () => Promise<void>;
  token: string | undefined;
}

const HeaderController = ({ logout, token }: Props) => {
  const router = useRouter();

  if (!token) {
    return (
      <Link href="/auth/login">
        <button className={styles.loginButton}>로그인</button>
      </Link>
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
