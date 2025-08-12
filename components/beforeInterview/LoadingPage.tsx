'use client';

import styles from './styles/container.module.css';

import { useEffect, useState } from 'react';
import { GeneratedQuestionItem } from '@/utils/types/types';
import { v4 as uuid } from 'uuid';
import LoadingItemList from './loadingPage/LoadingItemList';
import LoadingAnimation from './loadingPage/LoadingAnimation';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage = (props: LoadingPageProps) => {
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestionItem[]
  >([]);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'fail' | 'success'>(
    'loading',
  );

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/generate-question/test/${TEST_ID}?mock=true`,
    );

    eventSource.addEventListener('question', (e) => {
      const q = JSON.parse(e.data);
      setGeneratedQuestions((prev) => [...prev, { ...q, id: uuid() }]);
    });

    eventSource.addEventListener('done', () => {
      console.log('DONE');
      setStatus('success');

      eventSource.close();
    });

    eventSource.onerror = (error) => {
      console.log('EventSource failed:', error);

      setStatus('fail');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (generatedQuestions.length > 0) {
      const goal = 20;
      const questions = generatedQuestions.length;

      setProgress(questions * (100 / goal));
    }
  }, [generatedQuestions]);

  useEffect(() => {
    if (status === 'success') {
      props.onLoadingComplete();
    }
  }, [props, status]);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <LoadingAnimation progress={progress} />
      </div>
      <div className={styles.rightContainer}>
        <LoadingItemList questions={generatedQuestions} />
      </div>
    </div>
  );
};

export default LoadingPage;
