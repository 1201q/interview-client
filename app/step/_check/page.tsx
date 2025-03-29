import WebcamClient from '@/components/camera/WebcamClient';
import { STEP } from '@/utils/constants/interview.step';
import Link from 'next/link';
import styles from './page.module.css';

const CheckPage = ({ step }: { step: string }) => {
  const nextStepIndex = STEP.findIndex((s) => s.page === step) + 1;

  return (
    <div className={styles.container}>
      <Link href={`/step/${STEP[nextStepIndex].page}`}>다음단계</Link>
      {/* <WebcamClient /> */}
    </div>
  );
};

export default CheckPage;
