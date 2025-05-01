import styles from '../../page.module.css';

import Button from '@/components/common/Button';
import DeviceCheckHeader from './DeviceCheckHeader';
import MicTestComponent from './MicTestComponent';
import { useState } from 'react';

interface Props {
  nextStep?: () => void;
}

const MicTest = ({ nextStep }: Props) => {
  const [isDisplayNextButton, setIsDisplayNextButton] = useState(false);

  return (
    <>
      <div className={styles.listHeaderContainer}>
        <DeviceCheckHeader text={'마이크 체크'} />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <div className={styles.centerContainer}>
            <div className={styles.slideListContainer}>
              <MicTestComponent
                displayNextButton={() => setIsDisplayNextButton(true)}
              />
            </div>
            {isDisplayNextButton && (
              <Button
                disabled={false}
                text="다음단계로"
                color="blue"
                onClick={nextStep}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MicTest;
