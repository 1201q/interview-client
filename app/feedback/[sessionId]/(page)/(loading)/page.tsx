import { getAnalyesStatuses } from '@/utils/services/analyses';
import { redirect } from 'next/navigation';

export default async function Page({
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
  } else {
    redirect(`/feedback/${sessionId}/progress`);
  }
}
