import styles from '../../page.module.css';
import FaceScan from '@/public/face-scan.svg';
import Light from '@/public/light.svg';
import Ruler from '@/public/ruler.svg';

import SlideInfo from './SlideInfo';
import Button from '@/components/common/Button';
import DeviceCheckHeader from './DeviceCheckHeader';

interface Props {
  nextStep?: () => void;
}

const CameraInstructions = ({ nextStep }: Props) => {
  return (
    <>
      <div className={styles.listHeaderContainer}>
        <DeviceCheckHeader text={'카메라 사용에 대한 안내'} />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <div className={styles.centerContainer}>
            <div className={styles.slideListContainer}>
              <SlideInfo
                image={<FaceScan />}
                titleText="얼굴은 중앙에 위치"
                subtitleText={
                  <>
                    <p>
                      얼굴 전체가 <strong>화면 중앙</strong>에
                    </p>
                    <p> 잘 보이는지 확인하세요.</p>
                  </>
                }
              />
              <SlideInfo
                image={<Ruler />}
                titleText="적절한 거리 유지"
                subtitleText={
                  <>
                    <p>
                      얼굴이 카메라로부터 <strong>50 ~ 70cm</strong>
                    </p>
                    <p>거리에 위치하도록 조절해주세요.</p>
                  </>
                }
              />
              <SlideInfo
                image={<Light />}
                titleText="충분한 광량 확보"
                subtitleText={
                  <>
                    <p>얼굴이 선명하게 보이도록</p>
                    <p>
                      <strong>충분한 조명이 있는 환경</strong>에서 이용해
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

export default CameraInstructions;
