'use client';

import styles from './loading.module.css';

import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className={styles.bg}>
      <div className={styles.loaderContents}>
        <div className={styles.loader}>
          <Loader2 />
        </div>
      </div>
    </div>
  );
};

export default Loading;
