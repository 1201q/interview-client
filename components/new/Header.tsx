import styles from './styles/header.module.css';
import Logo from '@/public/aiterviewlogo.svg';

const SharedHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Logo />
      </div>
    </div>
  );
};

export default SharedHeader;
