'use client';

import InterviewClient from '@/components/interview-progress/InterviewClient';
import InterviewHeader from '@/components/interview-progress/InterviewHeader';
import { useInterview } from '@/components/interview-progress/InterviewProvider';

import { Suspense } from 'react';

const Page = () => {
  const { ...props } = useInterview();

  return (
    <>
      <header className="header">
        <InterviewHeader />
      </header>
      <div className="contents">
        <Suspense fallback={<div>1</div>}>
          <InterviewClient {...props} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
