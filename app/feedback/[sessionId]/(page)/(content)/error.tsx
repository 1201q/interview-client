'use client';

import Button from '@/components/shared/Button';
import styles from './error.module.css';
import { CircleAlertIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function Error({ error }: ErrorProps) {
  const isQuestionFailed = error.message === 'REQUEST_FAILED'; // 상태가 'failed' OR 'working'인 경우
  const router = useRouter();

  return (
    <>
      <header className="header"></header>
      <div className="contents">
        <div className={styles.container}>
          <CircleAlertIcon className={styles.icon} />
          <h1>{'문제가 발생했네요!'}</h1>
          <h4>
            {isQuestionFailed
              ? '해당 요청은 진행할 수 없습니다. 다시 새로운 요청을 생성해주세요.'
              : '요청 처리 중 문제가 발생했습니다.'}
          </h4>
          <div className={styles.buttons}>
            <Button
              text="첫 화면으로"
              color="gray"
              onClick={() => router.replace('/new-request/resume')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
