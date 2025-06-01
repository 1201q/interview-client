'use client';

import Loading from '@/components/common/Loading';
import styles from './page.module.css';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAnalysisProgress } from '@/utils/services/analysis';

const AnalysisPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const interval = setInterval(async () => {
      try {
        const { status, percent } = await getAnalysisProgress(id);

        if (percent) {
          setPercent(percent);
        }

        if (status === 'done') {
          clearInterval(interval);
          router.replace(`/result/${id}`);
        }
      } catch (error) {
        alert('실패');
        router.back();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.centerContainer}>
        <Loading size={50} color="white" />
        <div className={styles.textContainer}>
          <p>질문 분석 중</p>
          <p>{percent}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
