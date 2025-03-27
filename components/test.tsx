'use client';

import { STEP } from '@/utils/constants/interview.step';
import { useRouter } from 'next/navigation';

const Test = ({ step }: { step: string }) => {
  const router = useRouter();
  const nextStepIndex = STEP.findIndex((s) => s.page === step) + 1;

  return (
    <div>
      <button
        onClick={() => {
          router.push(`/step/${STEP[nextStepIndex].page}`);
        }}
      >
        다음단계
      </button>
    </div>
  );
};

export default Test;
