'use client';

import { useTransition } from 'react';
import styles from './styles/bottom.user.module.css';
import { useRouter } from 'next/navigation';

const LogoutButton = ({
  action,
  user,
}: {
  action: () => Promise<void>;
  user: { id: string; name: string; email: string };
}) => {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      className={styles.item}
      onClick={() =>
        start(async () => {
          await action();
          router.refresh();
        })
      }
      disabled={pending}
    >
      <div className={styles.profile}></div>
      <div className={styles.user}>
        <p className={styles.name}>{user.name}</p>
        <p className={styles.email}>{user.email}</p>
      </div>
    </button>
  );
};

export default LogoutButton;
