'use client';

import Button from '@/components/common/Button';

import { useRouter } from 'next/navigation';

import BottomController from '@/components/common/BottomController';
import { useAtom } from 'jotai';
import { micCheckCompletedAtom } from '@/store/step';

const MicCheckController = () => {
  const router = useRouter();

  const [completed] = useAtom(micCheckCompletedAtom);

  return (
    <BottomController
      rightContent={
        <Button
          text={!completed ? '마이크 체크를 완료해주세요' : '다음 단계로 이동'}
          disabled={!completed}
          onClick={() => {
            router.push('/device_check/camera');
          }}
          color="blue"
        />
      }
    />
  );
};

export default MicCheckController;
