'use client';

import styles from './page.module.css';
import NewHeader from '@/components/header/NewHeader';

import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import ProgressRing from './_components/ProgressRing';
import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import TextRender from './_components/TextRender';
import Header from '../../components/Header';

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
          1<div className={styles.sideContainer}>{/* <Controller /> */}1</div>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;
