'use client';

import styles from '../../page.module.css';

import Button from '@/components/common/Button';
import DeviceCheckHeader from './DeviceCheckHeader';

import SlideInfo from './SlideInfo';
import Check from '@/public/check-circle.svg';

import { useRequestMediaAccess } from './hooks/useRequestMediaAccess';

interface Props {
  nextStep: () => void;
}

const PermissionCheck = ({ nextStep }: Props) => {
  const { camera, mic } = useRequestMediaAccess();

  const check = camera && mic;

  return (
    <>
      <div className={styles.listHeaderContainer}>
        <DeviceCheckHeader text={'카메라 / 마이크 권한 체크'} />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <div className={styles.centerContainer}>
            <SlideInfo
              image={<Check />}
              titleText="권한 허용"
              subtitleText={
                <>
                  <p>브라우저가 카메라와 마이크의 접근 권한을</p>
                  <p>
                    요청할 경우 <strong>허용</strong>을 눌러주세요.
                  </p>
                </>
              }
            />

            <Button
              disabled={!check}
              text={!check ? '권한을 허용해주세요' : '다음으로'}
              color="blue"
              onClick={nextStep}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionCheck;
