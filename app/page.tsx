import Header from '@/components/shared/Header';
import styles from './page.module.css';
import Footer from '@/components/shared/Footer';

const Page = () => {
  // page
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.contents}>
          <div style={{ height: '1200px' }}>1</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
