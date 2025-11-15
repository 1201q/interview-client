import styles from './page.module.css';

import LandingHeader from '@/components/landing/LandingHeader';

import { getAuth } from '@/utils/services/auth';
import { cookies } from 'next/headers';

import HeroSection from '@/components/landing/HeroSection';

const Page = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  const isLoggedIn = Boolean(auth.user && refreshToken);

  return (
    <div className={styles.container}>
      <div className={`${styles.heroBg} ${styles.heroFog}`}>
        <LandingHeader isLoggedIn={isLoggedIn} />
        <main className={styles.main}>
          <HeroSection isLoggedIn />
        </main>
      </div>
    </div>
  );
};

export default Page;
