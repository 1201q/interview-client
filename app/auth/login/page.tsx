import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';
import Github from '@/public/github.svg';

const Page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.topContainer}>
          <div className={styles.headerContainer}>
            <p className={styles.logo}>AiTerview</p>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.loginContainer}>
            <div className={styles.textContainer}>
              <p className={styles.welcomeText}>로그인</p>
            </div>
            <div className={styles.loginBox}>
              <p className={styles.mediumText}>소셜 로그인</p>
              <div className={styles.buttonContainer}>
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                  <button className={styles.loginButton}>
                    <Image
                      src={'/google-logo.png'}
                      alt="구글로고"
                      width={25}
                      height={25}
                    />
                  </button>
                </Link>
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                  <button className={styles.loginButton}>
                    <Github />
                  </button>
                </Link>
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                  <button className={styles.loginButton}>
                    <Github />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
