import ToggleButton from './ToggleButton';
import styles from './styles/top.module.css';
import Logo from '@/public/LOGO.svg';

const TopLogo = () => {
  return (
    <div className={styles.top}>
      <Logo />
      <ToggleButton />
    </div>
  );
};

export default TopLogo;
