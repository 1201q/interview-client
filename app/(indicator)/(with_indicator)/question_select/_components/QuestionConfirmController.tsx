'use client';

import Button from '@/components/common/Button';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomController from '@/components/common/BottomController';
import { useAtomValue } from 'jotai';
import { submitSelectedQuestionsAtom } from '@/store/select';
import { createInterviewSession } from '@/utils/actions/createInterviewSession';

const QuestionConfirmController = () => {
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const submitData = useAtomValue(submitSelectedQuestionsAtom);

  const handleCreateInterviewSession = async () => {
    setLoading(true);
    try {
      await createInterviewSession(submitData);

      router.replace('/device_check/mic');
    } catch (error) {
      alert('인터뷰 세션 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
          text={!loading ? '환경체크로 이동' : '로딩중...'}
          disabled={buttonDisabled || loading}
          onClick={() => {
            handleCreateInterviewSession();
          }}
          color="blue"
        />
      }
    />
  );
};

export default QuestionConfirmController;
