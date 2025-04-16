import ListLoader from '@/components/select/ListLoader';
import styles from '../../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/Sidebar';

const AiSelectPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.sideMenuContainer}>
          <SidebarServer />
        </div>
        <div className={styles.listContainer}>
          <ListLoader />
        </div>
      </div>
    </div>
  );
};

export default AiSelectPage;
