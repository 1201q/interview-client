'use client';

import SharedButton from '@/components/new/Button';
import { resetInterviewSession } from '@/utils/services/interviewSession';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ResetButtonsProps {
  sessionId: string;
  redirectTo: string;
}

const ResetButtons = ({ sessionId, redirectTo }: ResetButtonsProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState<'reset' | 'end' | null>(null);

  const onReset = async () => {
    try {
      setLoading('reset');
      await resetInterviewSession(sessionId);
      router.replace(redirectTo);
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? '초기화 실패');
      setLoading(null);
    }
  };

  return (
    <>
      <SharedButton
        text={loading === 'reset' ? '초기화 중...' : '초기화'}
        loading={loading === 'reset'}
        disabled={loading !== null}
        onClick={onReset}
        color="blue"
      />
    </>
  );
};

export default ResetButtons;
