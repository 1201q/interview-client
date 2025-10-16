import ToggleButton from './ToggleButton';
import styles from './styles/top.module.css';
import Logo from '@/public/aiterviewlogo.svg';

const TopLogo = ({ toggleState }: { toggleState: 'mini' | 'expanded' }) => {
  return (
    <div className={styles.top}>
      <Logo />
      <ToggleButton toggleState={toggleState} />
    </div>
  );
};

export default TopLogo;
