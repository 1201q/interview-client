import styles from './_styles/need-login.module.css';
import Link from 'next/link';

const NeedLogin = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <p className={styles.text}>해당 기능은</p>
        <p className={styles.text}>로그인 후 사용할 수 있어요</p>
        <div className={styles.buttonContainer}>
          <Link
            href={{
              pathname: '/login',
              query: { prevPage: 'select' },
            }}
          >
            <button className={styles.loginButton}>로그인하기</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NeedLogin;
