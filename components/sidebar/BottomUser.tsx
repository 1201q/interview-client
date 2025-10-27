import { cookies } from 'next/headers';

import styles from './styles/bottom.user.module.css';
import { getAuth } from '@/utils/services/auth';

import UserProfile from './UserProfile';

const BottomUser = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!auth.user || !refreshToken) return null;

  return (
    <div className={styles.bottom}>
      <UserProfile user={auth.user} />
    </div>
  );
};

export default BottomUser;
