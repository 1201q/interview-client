'use client';

import { ReactNode } from 'react';
import styles from './styles/container.module.css';

import { motion } from 'motion/react';

interface Props {
  title: string;
  subTitle: string;
  icon: React.JSX.Element;
  children: ReactNode;
}

const CheckContainer = ({ title, subTitle, icon, children }: Props) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.titleContainer}>
        <div className={styles.titleTextContainer}>
          {icon}
          <p>{title}</p>
        </div>
        <span>{subTitle}</span>
      </div>
      <div className={styles.component}>{children}</div>
    </motion.div>
  );
};

export default CheckContainer;
