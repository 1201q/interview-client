'use client';

import Loading from '@/components/common/Loading';
import styles from './styles/session.loading.module.css';
import { submitSelectedQuestionsAtom } from '@/store/select';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { createInterviewSession } from '@/utils/actions/session';
import { useRouter } from 'next/navigation';

const SessionLoading = () => {
  const submitData = useAtomValue(submitSelectedQuestionsAtom);

  useEffect(() => {
    const submit = async () => {
      try {
        await createInterviewSession(submitData);
      } catch (error) {
        console.error('Error creating interview session:', error);
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

export default SessionLoading;
