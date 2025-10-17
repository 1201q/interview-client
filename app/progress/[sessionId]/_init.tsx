'use client';

import InterviewClient from '@/components/progress/InterviewClient';
import InterviewSidebar from '@/components/progress/InterviewSidebar';
import { useInterview } from '@/utils/hooks/useInterview';

import {
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';

interface InterviewInitProps {
  sessionId: string;
  questions: SessionQuestionItemWithAnswerId[];
  status: InterviewSessionStatus;
}

const InterviewInit = ({
  sessionId,
  questions,
  status,
}: InterviewInitProps) => {
  const interview = useInterview({ sessionId, questions, status });

  return (
    <>
      <aside className="sidebar">
        <InterviewSidebar
          status={interview.serverStatus}
          questions={interview.clientQuestions}
        />
      </aside>
      <main className="main">
        <InterviewClient {...interview} />
      </main>
    </>
  );
};

export default InterviewInit;
