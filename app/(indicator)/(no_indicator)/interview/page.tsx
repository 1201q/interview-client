'use client';

import Loading from '@/components/common/Loading';
import styles from './page.module.css';
import { submitSelectedQuestionsAtom } from '@/store/select';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { createInterviewSession } from '@/utils/actions/session';
import { useRouter } from 'next/navigation';

const Page = () => {
  const submitData = useAtomValue(submitSelectedQuestionsAtom);
  const router = useRouter();

  useEffect(() => {
    const submit = async () => {
      try {
        const sessionId = await createInterviewSession(submitData);

        router.replace(`/interview/running/${sessionId}`);
      } catch (error) {
        console.error('Error creating interview session:', error);

        alert('실패');

        router.back();
      }
    };

    submit();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.centerContainer}>
        <Loading size={50} color="white" />
        <p>인터뷰 세션 생성 중</p>
      </div>
    </div>
  );
};

export default Page;
