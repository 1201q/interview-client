import Indicator from './question_select/_components/Indicator';
import styles from './page.module.css';
import { Suspense } from 'react';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <Indicator />
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
};

export default Layout;
