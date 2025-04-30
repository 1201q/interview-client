import Indicator from './question_select/_components/Indicator';
import styles from './page.module.css';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <Indicator />
        {children}
      </div>
    </div>
  );
};

export default Layout;
