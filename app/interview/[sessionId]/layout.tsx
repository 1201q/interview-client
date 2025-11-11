import {
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';
import InterviewProvider, {
  InterviewInitial,
} from '@/components/interview-progress/core/InterviewProvider';
import InterviewInProgressOverlay from '@/components/interview-progress/overlays/InterviewInProgressOverlay';
import InterviewCompletedOverlay from '@/components/interview-progress/overlays/InterviewCompletedOverlay';
import InterviewNotFoundOverlay from '@/components/interview-progress/overlays/InterviewNotFoundOverlay';
import { cookies } from 'next/headers';

type SessionDetailResponse = {
  session_id: string;
  status: InterviewSessionStatus;
  created_at: string;
  questions: SessionQuestionItemWithAnswerId[];
};

const getSession = async (sessionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}`;

  const cookie = cookies().toString();

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie,
      accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<SessionDetailResponse>;
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const data = await getSession(sessionId);

  if (!data) {
    return <InterviewNotFoundOverlay />;
  }

  if (data.status === 'in_progress') {
    return <InterviewInProgressOverlay sessionId={sessionId} />;
  }

  if (data.status === 'completed') {
    return <InterviewCompletedOverlay sessionId={sessionId} />;
  }

  const initialData: InterviewInitial = {
    sessionId: data.session_id,
    status: data.status,
    questions: data.questions,
  };

  return (
    <InterviewProvider initialData={initialData}>{children}</InterviewProvider>
  );
}
