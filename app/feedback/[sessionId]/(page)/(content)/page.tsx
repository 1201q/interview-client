import SoftRedirect from '@/components/shared/SoftRedirect';
import { getAnalyesStatuses } from '@/utils/services/analyses';
import { notFound, redirect } from 'next/navigation';
import InterviewSkeleton from './[answerId]/loading';

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  try {
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

    redirect(`/feedback/${sessionId}/progress`);
  } catch (error: any) {
    if (error?.status === 404) notFound();
    throw new Error('REQUEST_FAILED');
  }
}
