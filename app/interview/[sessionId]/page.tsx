'use client';

import InterviewClient from '@/components/interview-progress/InterviewClient';
import InterviewHeader from '@/components/interview-progress/InterviewHeader';
import { useInterview } from '@/components/interview-progress/InterviewProvider';

const Page = () => {
  const { ...props } = useInterview();

  return (
    <>
      <header className="header">
        <InterviewHeader />
      </header>
      <div className="contents">
        <InterviewClient {...props} />
      </div>
    </>
  );
};

export default Page;
