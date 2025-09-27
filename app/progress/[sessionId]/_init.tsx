'use client';

import InterviewClient from '@/components/progress/InterviewClient';
import InterviewSidebar from '@/components/progress/InterviewSidebar';
import { useInterview } from '@/utils/hooks/useInterview';
import { useTranscribe } from '@/utils/hooks/useTranscribe';

import {
  getInterviewSessionDetail,
  startAnswer,
  startInterviewSession,
  submitAnswer,
} from '@/utils/services/interviewSession';
import {
  InterviewPhase,
  InterviewSessionStatus,
  QSessionQuestionItem,
} from '@/utils/types/interview';

import { useEffect, useState } from 'react';

interface InterviewInitProps {
  sessionId: string;
  questions: QSessionQuestionItem[];
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
        <InterviewSidebar questions={interview.clientQuestions} />
      </aside>
      <main className="main">
        <InterviewClient {...interview} />
      </main>
    </>
  );
};

export default InterviewInit;
