'use client';

import Header from '@/components/shared/Header';
import styles from './page.module.css';
import Footer from '@/components/shared/Footer';
import CreateQuestion from '@/components/createQuestion/CreateQuestion';

const Page = () => {
  // page
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.contents}>
          <CreateQuestion />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
