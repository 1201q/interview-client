import Header from '@/components/header/Header';
import styles from './page.module.css';
import Landing from '@/components/landing/Landing';

const Page = () => {
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.contentsContainer}>
        <Landing />
      </div>
    </div>
  );
};

export default Page;
