'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useInterview as useInterviewSingleton } from '@/utils/hooks/useInterview';
import {
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';

export type InterviewInitial = {
  sessionId: string;
  status: InterviewSessionStatus; // 서버측 세션 상태
  questions: SessionQuestionItemWithAnswerId[]; // questions with answer IDs
};

const InterviewContext = createContext<ReturnType<
  typeof useInterviewSingleton
> | null>(null);

export default function InterviewProvider({
  initialData,
  children,
}: {
  initialData: InterviewInitial;
  children: React.ReactNode;
}) {
  const value = useInterviewSingleton({
    sessionId: initialData.sessionId,
    status: initialData.status,
    questions: initialData.questions,
  });

  const mem = useMemo(() => value, [value]);

  return (
    <InterviewContext.Provider value={mem}>
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context)
    throw new Error('useInterview must be used within an InterviewProvider');

  return context;
};
