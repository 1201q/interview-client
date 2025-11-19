'use client';

import Button from '@/components/shared/Button';
import styles from './error.module.css';
import { CircleAlertIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <header className="header"></header>
      <div className="contents">
        <div className={styles.container}>
          <CircleAlertIcon className={styles.icon} />
          <h1>{'해당 요청을 찾을 수 없어요.'}</h1>
          <h4>{'요청 ID가 잘못됐거나 삭제된 요청일 수 있습니다.'}</h4>
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
