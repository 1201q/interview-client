'use client';

import InterviewClient from '@/components/progress/InterviewClient';
import InterviewSidebar from '@/components/progress/InterviewSidebar';

import {
  getInterviewSessionDetail,
  startInterviewSession,
} from '@/utils/services/interviewSession';
import {
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
  const [clientQuestions, setClientQuestions] = useState(questions);
  const [serverStatus, setServerStatus] = useState(status);

  // const []

  const startSession = async () => {
    await startInterviewSession(sessionId);

    refresh();
  };

  const refresh = async () => {
    const res = await getInterviewSessionDetail(sessionId);

    setClientQuestions(res.questions);
    setServerStatus(res.status);
  };

  const startAnswer = () => {};

  useEffect(() => {
    console.log(clientQuestions);
    console.log(serverStatus);
  }, [clientQuestions, serverStatus]);

  return (
    <>
      <aside className="sidebar">
        <InterviewSidebar />
      </aside>
      <main className="main">
        <InterviewClient />
      </main>
      <>
        <button
          style={{ position: 'fixed' }}
          onClick={() => {
            refresh();
          }}
        >
          클릭1
        </button>
        <button
          style={{ position: 'fixed', left: 50 }}
          onClick={() => {
            startSession();
          }}
        >
          클릭2
        </button>
      </>
    </>
  );
};

export default InterviewInit;
