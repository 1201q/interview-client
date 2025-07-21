import styles from './styles/header.module.css';
import { BotIcon, UserCircle } from 'lucide-react';

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.contents}>
        <div className={styles.itemContainer}>
          <BotIcon width={27} height={27} />
          <p>Ai Interview</p>
        </div>
        <div className={styles.itemContainer}>
          <button className={styles.loginButton}>
            <UserCircle width={25} height={25} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
