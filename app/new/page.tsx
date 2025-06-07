'use client';

import NewHeader from '@/components/header/NewHeader';
import styles from './page.module.css';
import Header from './components/Header';
import Container from './components/Container';
import ResumeLoading from './components/ResumeLoading';
import { useState } from 'react';

const Page = () => {
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
  };

  return (
    <div className={styles.container}>
      <NewHeader />
      <div
        className={`${loading ? styles.loadingBgContainer : styles.bgContainer}`}
      ></div>
      <div className={styles.contents}>
        {!loading && (
          <>
            <Header />
            <Container submit={submit} />
          </>
        )}

        {loading && <ResumeLoading />}
      </div>
    </div>
  );
};

export default Page;
