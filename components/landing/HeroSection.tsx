import styles from './styles/hero.module.css';
import Link from 'next/link';

const HeroSection = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.deco}>
        <div className={styles.deco1}></div>
        <div className={styles.deco2}></div>
        <div className={styles.deco3}></div>
        <div className={styles.deco4}></div>
        <div className={styles.deco5}></div>
      </div>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <div className={styles.banner}>
            <h1 className={styles.title}>AI.terview</h1>
            <p className={styles.desc}>AI로 면접 합격까지</p>
          </div>
        </div>
        <div className={styles.buttons}>
          {isLoggedIn ? (
            <Link href="/new-request">
              <button className={styles.button}>서비스로 이동하기</button>
            </Link>
          ) : (
            <Link href="/login">
              <button className={styles.button}>무료로 이용하기</button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
