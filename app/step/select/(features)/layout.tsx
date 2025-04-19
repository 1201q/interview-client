import styles from '../../_styles/page.module.css';
import { cookies, headers } from 'next/headers';
import NeedLogin from './need-login';
import BackButton from '@/components/select/sidebar/BackButton';

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const isLoggedIn = (await cookies()).has('accessToken');

  const header = headers();
  const pathname = (await header).get('x-pathname');

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.sideMenuContainer}>
          <BackButton />
        </div>
        <div className={styles.listContainer}>
          {isLoggedIn ? children : <NeedLogin />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
