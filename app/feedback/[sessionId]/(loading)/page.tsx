import InterviewCompleted from '@/components/interview-progress/InterviewCompleted';
import { getAnalyesStatuses } from '@/utils/services/analyses';
import { redirect } from 'next/navigation';

export default async function Layout({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const data = await getAnalyesStatuses(sessionId);

  const allDone = data.statuses.every(
    (s) =>
      s.analysis_status === 'completed' ||
      (typeof s.analysis_progress === 'object' &&
        s.analysis_progress.overall === 100),
  );

  if (allDone) {
    const firstAnswer = data.statuses[0];

    const firstAnswerId = firstAnswer.answer_id;

    redirect(`/feedback/${sessionId}/${firstAnswerId}`);
  }

  return (
    <InterviewCompleted sessionId={data.session_id} statuses={data.statuses} />
  );
}
