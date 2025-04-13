import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';

const FavoriteSelectPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>1</div>
      </div>
    </div>
  );
};

export default FavoriteSelectPage;
