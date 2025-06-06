import styles from './styles/new.header.module.css';
import Logo from '@/public/openai.svg';
import Image from 'next/image';

const NewHeader = () => {
  return (
    <header className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <Image alt="logo" src={'/logo.png'} width={100} height={20} />
          </div>
        </div>
        <div className={styles.box}>
          <button className={styles.menuButton}>AI 면접</button>
          <button className={styles.menuButton}>로그인</button>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
