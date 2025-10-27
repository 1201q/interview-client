import styles from './loading.module.css';

import { Loader2Icon } from 'lucide-react';

const ModalLoading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingBox}>
        <Loader2Icon size={60} />
      </div>
    </div>
  );
};
export default ModalLoading;
