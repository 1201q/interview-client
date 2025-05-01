'use client';

import PermissionCheck from './_components/PermissionCheck';

import styles from '../page.module.css';
import SideMenu from './_components/SideMenu';

import PageHeader from './_components/PageHeader';

const STEP = [
  { name: '안내', code: 'instructions' },
  { name: '권한체크', code: 'permission' },
  { name: '카메라체크', code: 'check_camera' },
  { name: '마이크체크', code: 'check_mic' },
];

const DeviceCheckPage = () => {
  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.sideSelectContainer}>
          <SideMenu
            number={1}
            text="권한 체크"
            isCompleted={true}
            isSelected={false}
          />
          <SideMenu
            number={2}
            text="마이크 체크"
            isCompleted={false}
            isSelected={true}
          />
          <SideMenu
            number={3}
            text="카메라 체크"
            isCompleted={false}
            isSelected={false}
          />
        </div>
        <div className={styles.itemListContainer}>
          <PageHeader
            titleText="권한 체크"
            subtitleText="마이크와 카메라 권한이 필요해요."
          />
          <PermissionCheck nextStep={() => {}} />
        </div>
      </div>
    </>
  );
};

export default DeviceCheckPage;
