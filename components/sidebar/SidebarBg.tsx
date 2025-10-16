import { ReactNode } from 'react';
import styles from './styles/sidebar.bg.module.css';

const SidebarBg = ({ children }: { children: ReactNode }) => {
  return <div className={styles.steps}>{children}</div>;
};

export default SidebarBg;
