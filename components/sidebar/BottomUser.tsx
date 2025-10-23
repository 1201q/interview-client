import { cookies } from 'next/headers';

import styles from './styles/bottom.user.module.css';
import { getAuth } from '@/utils/services/auth';

import { logout } from '@/utils/actions/logout';
import LogoutButton from './LogoutButton';

const BottomUser = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!auth.user || !refreshToken) return null;

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
