import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';

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
              <p className={styles.welcomeText}>로그인하고 더 많은 기능을</p>
              <p className={styles.welcomeText}>이용해보세요</p>
            </div>
            <div className={styles.buttonContainer}>
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
                <button className={styles.loginButton}>
                  <div className={styles.buttonLogo}>
                    <Image
                      src={'/google-logo.png'}
                      alt="구글로고"
                      width={25}
                      height={25}
                    />
                  </div>
                  <p>구글로 로그인</p>
                </button>
              </Link>
              <button className={styles.loginButton}>
                <div className={styles.buttonLogo}>
                  <Image
                    src={'/github-mark.png'}
                    alt="github로고"
                    width={25}
                    height={25}
                  />
                </div>
                <p>Github으로 로그인</p>
              </button>
              <button className={styles.loginButton}>
                <div className={styles.buttonLogo}>
                  <Image
                    src={'/naver-logo.png'}
                    alt="네이버로고"
                    width={25}
                    height={25}
                  />
                </div>
                <p>네이버로 로그인</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
