import { ReactNode } from 'react';
import styles from './styles/sidebar.bg.module.css';

const SidebarBg = ({
  children,
  type = 'default',
}: {
  children: ReactNode;
  type?: 'default' | 'dark';
}) => {
  return (
    <div className={`${styles.steps} ${type === 'dark' ? styles.dark : ''}`}>
      {children}
    </div>
  );
};

export default SidebarBg;
