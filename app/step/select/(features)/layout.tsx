import styles from '../../_styles/page.module.css';
import { cookies } from 'next/headers';
import NeedLogin from './need-login';
import BackButton from '@/components/select/sidebar/BackButton';

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const isLoggedIn = (await cookies()).has('accessToken');

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <BackButton />
        </div>
        <div className={styles.questionListContainer}>
          {isLoggedIn ? children : <NeedLogin />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
