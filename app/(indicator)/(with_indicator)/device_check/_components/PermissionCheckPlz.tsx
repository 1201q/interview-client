import SlideInfo from './SlideInfo';
import Check from '@/public/check-circle.svg';

import styles from './styles/permission.module.css';
import { useRequestMediaAccess } from './hooks/useRequestMediaAccess';

import Mic from '@/public/mic.svg';
import Camera from '@/public/webcam-cam.svg';
import { usePermissonCheck } from './hooks/usePermissonCheck';

const PermissionCheckPlz = () => {
  useRequestMediaAccess();
  const cameraPerm = usePermissonCheck('camera');
  const micPerm = usePermissonCheck('microphone');

  const dotStatus = (status: boolean | null) => {
    if (status === null) {
      return styles.loading;
    } else if (!status) {
      return styles.red;
    } else {
      return styles.green;
    }
  };

  return (
    <div className={styles.container}>
      <SlideInfo
        titleText="권한 확인"
        subtitleText={
          <>
            <p>카메라와 마이크 권한이 필요해요.</p>
            <p>팝업창이 나타나면 허용을 눌러주세요.</p>
          </>
        }
        image={<Check />}
      />
      <div className={styles.itemContainer}>
        <div className={styles.item}>
          <div className={styles.flex}>
            <Mic />
            <p>마이크 권한</p>
          </div>
          <div className={styles.flex}>
            <div className={`${styles.dot} ${dotStatus(micPerm)}`}></div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.flex}>
            <Camera />
            <p>카메라 권한</p>
          </div>
          <div className={styles.flex}>
            <div className={`${styles.dot} ${dotStatus(cameraPerm)}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheckPlz;
