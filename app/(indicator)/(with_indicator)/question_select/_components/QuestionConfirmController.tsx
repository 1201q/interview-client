'use client';

import Button from '@/components/common/Button';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomController from '@/components/common/BottomController';

const QuestionConfirmController = () => {
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonDisabled(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BottomController
      rightContent={
        <Button
          text={'환경체크로 이동'}
          disabled={buttonDisabled}
          onClick={() => {
            router.push('/device_check/audio');
          }}
          color="blue"
        />
      }
    />
  );
};

export default QuestionConfirmController;
