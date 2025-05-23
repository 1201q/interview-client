import { ReactNode } from 'react';
import styles from './styles/container.module.css';

interface Props {
  headerTitle: string;
  subtitle?: string;
  children?: ReactNode;
}

const InfoContainer = ({ headerTitle, subtitle, children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <p>{headerTitle}</p>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <div className={styles.contents}>{children}</div>
    </div>
  );
};

export default InfoContainer;
