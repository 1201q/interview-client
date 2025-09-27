import './new.css';
import styles from './layout.module.css';
import SharedHeader from '@/components/new/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <SharedHeader />
      </header>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
}
