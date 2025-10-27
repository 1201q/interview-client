import Link from 'next/link';
import styles from './styles/login.user.modal.module.css';

import { LogOutIcon, HomeIcon } from 'lucide-react';

const LoginUserModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className={styles.bg} onClick={onClose}>
      <div className={styles.modal}>
        <Link href={'/'} className={styles.modalItem}>
          <HomeIcon size={16} />
          <span>홈으로</span>
        </Link>
        <Link href={'/logout'} className={styles.modalItem}>
          <LogOutIcon size={16} />
          <span>로그아웃</span>
        </Link>
      </div>
    </div>
  );
};
export default LoginUserModal;
