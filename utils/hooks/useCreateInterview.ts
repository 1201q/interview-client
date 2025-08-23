import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { GeneratedQuestionItem } from '../types/types';

const REQ_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';
const USER_ID = '88906d3d-8204-487b-93db-b4d436fca1df';

const useCreateInterview = () => {
  const [stage, setStage] = useState<'select' | 'loading'>('select');
  const router = useRouter();

  const onNext = (selectedQuestions: GeneratedQuestionItem[]) => {
    console.log(selectedQuestions);

    setStage('loading');
  };

  const onLoadingComplete = () => {
    router.push(`/select/${REQ_ID}`);
  };

  return {
    stage,
    onNext,
    onLoadingComplete,
  };
};

export default useCreateInterview;
