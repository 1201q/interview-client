import Lottie from 'react-lottie-player';
import styles from './styles/permission.guide.modal.module.css';
import permissionJson from '@/public/permission.json';
import Button from '@/components/common/Button';

const PermssionGuideModal = () => {
  return (
    <div className={styles.container}>
      <div className={styles.modalContainer}>
        <div className={styles.contents}>
          <div className={styles.lottieContainer}>
            <Lottie
              animationData={permissionJson}
              play
              style={{ width: 400, height: 350 }}
            />
          </div>
          <div className={styles.titleContainer}>
            <p>디바이스 권한 필요</p>
            <span>해당 서비스는 카메라 권한과 마이크 권한이 필요해요.</span>
            <span>아래 버튼을 누르고 허용을 눌러주세요.</span>
          </div>
          <div className={styles.buttonContainer}>
            <Button disabled={false} text="요청" color="black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermssionGuideModal;
