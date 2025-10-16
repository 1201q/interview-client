import { cookies } from 'next/headers';

import styles from './styles/bottom.user.module.css';
import { getAuth } from '@/utils/services/auth';
import Link from 'next/link';
import { logout } from '@/utils/actions/logout';
import LogoutButton from './LogoutButton';

const BottomUser = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!auth.user || !refreshToken)
    return (
      <div className={styles.bottom}>
        <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
          <button>
            <span>google 로그인</span>
          </button>
        </Link>
      </div>
    );

  const action = async () => {
    'use server';
    await logout(refreshToken);
  };

  return (
    <div className={styles.bottom}>
      <LogoutButton action={action} user={auth.user} />
    </div>
  );
};

export default BottomUser;
