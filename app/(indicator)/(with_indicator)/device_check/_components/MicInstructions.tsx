import styles from '../../page.module.css';

import Mic from '@/public/mic.svg';

import SlideInfo from './SlideInfo';
import Button from '@/components/common/Button';
import DeviceCheckHeader from './DeviceCheckHeader';

interface Props {
  nextStep?: () => void;
}

const MicInstructions = ({ nextStep }: Props) => {
  return (
    <>
      <div className={styles.listHeaderContainer}>
        <DeviceCheckHeader text={'마이크 사용에 대한 안내'} />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <div className={styles.centerContainer}>
            <div className={styles.slideListContainer}>
              <SlideInfo
                image={<Mic />}
                titleText="조용한 환경"
                subtitleText={
                  <>
                    <p>마이크가 당신의 목소리를 기록할 예정이에요.</p>
                    <p>
                      <strong>잡음이 없는 조용한 환경</strong>에서 이용해
                      주세요.
                    </p>
                  </>
                }
              />
            </div>
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

export default MicInstructions;
