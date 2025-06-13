'use client';

import styles from './page.module.css';
import NewHeader from '@/components/header/NewHeader';

import Header from '../../components/Header';
import Controller from './_components/Controller';
import CheckContainer from './_components/CheckContainer';
import { CameraIcon, MicIcon } from 'lucide-react';
import CameraCheck from './_components/CameraCheck';
import MicCheck from './_components/MicCheck';

const CheckPage = () => {
  return (
    <div className={styles.container}>
      <NewHeader />
      <div className={styles.bgContainer}></div>
      <div className={styles.contents}>
        <Header
          title="카메라 & 마이크 확인"
          subTitle="면접을 시작하기 전에 카메라와 마이크가 정상적으로 작동하는지 확인해주세요."
        />
        <div className={styles.listContainer}>
          <div className={styles.mainContainer}>
            <CheckContainer
              title="카메라 테스트"
              subTitle="면접 중 화상 통화를 위해 카메라가 필요합니다."
              icon={<CameraIcon height={20} width={20} />}
            >
              <CameraCheck />
            </CheckContainer>
            <CheckContainer
              title="마이크 테스트"
              subTitle="면접 답변을 위해 마이크가 필요합니다."
              icon={<MicIcon height={20} width={20} />}
            >
              <MicCheck />
            </CheckContainer>
          </div>

          <div className={styles.sideContainer}>
            <Controller />
          </div>
        </div>
      </div>

      {/* <PermssionGuideModal /> */}
    </div>
  );
};

export default CheckPage;
