import InterviewAnalyzingOverlay from '@/components/interview-progress/overlays/InterviewAnalyzingOverlay';
import SoftRedirect from '@/components/shared/SoftRedirect';

import { getAnalyesStatuses } from '@/utils/services/analyses';
import InterviewSkeleton from '../(page)/(content)/[answerId]/loading';

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

    return (
      <SoftRedirect
        href={`/feedback/${sessionId}/${firstAnswerId}`}
        fallback={<InterviewSkeleton />}
      />
    );
  }

  return (
    <InterviewAnalyzingOverlay
      sessionId={data.session_id}
      statuses={data.statuses}
    />
  );
}
