'use client';

import Loading from '@/components/common/Loading';
import styles from './page.module.css';
import { submitSelectedQuestionsAtom } from '@/store/newSelect';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { newCreateInterviewSession } from '@/utils/actions/session';
import { useParams, useRouter } from 'next/navigation';

const Page = () => {
  const submitData = useAtomValue(submitSelectedQuestionsAtom);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (!submitData || submitData.length === 0 || !id) {
      alert('잘못된 요청입니다. 다시 시도해주세요.');
      router.back();
      return;
    }

    const submit = async () => {
      try {
        if (typeof id !== 'string') {
          alert('잘못된 인터뷰 ID입니다.');
          router.back();
          return;
        }

        const sessionId = await newCreateInterviewSession(submitData, id);

        router.replace(`/new/interview/running/${sessionId}`);
      } catch (error) {
        console.error('Error creating interview session:', error);

        alert('실패');

        router.back();
      }
    };

    submit();
  }, [id]);

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
