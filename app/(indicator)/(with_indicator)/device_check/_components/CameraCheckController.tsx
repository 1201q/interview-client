'use client';

import Button from '@/components/common/Button';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomController from '@/components/common/BottomController';
import { useAtom } from 'jotai';
import { cameraCheckCompletedAtom } from '@/store/step';

const CameraCheckController = () => {
  const router = useRouter();

  const [completed] = useAtom(cameraCheckCompletedAtom);

  return (
    <BottomController
      rightContent={
        <Button
          text={!completed ? '카메라 체크를 완료해주세요' : '다음 단계로 이동'}
          disabled={!completed}
          onClick={() => {
            router.push('/interview');
          }}
          color="blue"
        />
      }
    />
  );
};

export default CameraCheckController;
