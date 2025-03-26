import Header from '@/components/header/LadingHeader';
import styles from './page.module.css';
import Landing from '@/components/landing/Landing';

const Page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <Landing />
      </div>
    </div>
  );
};

export default Page;
