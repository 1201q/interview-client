import { STEP } from '@/utils/constants/interview.step';
import Link from 'next/link';

const CheckPage = ({ step }: { step: string }) => {
  const nextStepIndex = STEP.findIndex((s) => s.page === step) + 1;

  return (
    <div>
      <Link href={`/step/${STEP[nextStepIndex].page}`}>다음단계</Link>
    </div>
  );
};

export default CheckPage;
