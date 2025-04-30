import styles from '../../page.module.css';

import Button from '@/components/common/Button';
import DeviceCheckHeader from './DeviceCheckHeader';

interface Props {
  nextStep?: () => void;
}

const MicTest = ({ nextStep }: Props) => {
  return (
    <>
      <div className={styles.listHeaderContainer}>
        <DeviceCheckHeader text={'마이크 체크'} />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <div className={styles.centerContainer}>
            <div className={styles.slideListContainer}>1</div>
            <Button
              disabled={false}
              text="확인했어요"
              color="blue"
              onClick={nextStep}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MicTest;
