import styles from '../page.module.css';

import { ReactNode } from 'react';

import DeviceCheckSideMenu from './_components/DeviceCheckSideMenu';

interface Props {
  children: ReactNode;
}

const DeviceCheckLayout = ({ children }: Props) => {
  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.sideSelectContainer}>
          <DeviceCheckSideMenu />
        </div>
        <div className={styles.itemListContainer}>{children}</div>
      </div>
    </>
  );
};

export default DeviceCheckLayout;
