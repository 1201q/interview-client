'use client';

import styles from './layout.module.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AnimatePresence } from 'motion/react';

interface Props {
  children: React.ReactNode;
}

export default function PipeLineLayout({ children }: Readonly<Props>) {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <div className={styles.contents}>
          <AnimatePresence mode="wait">{children}</AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
