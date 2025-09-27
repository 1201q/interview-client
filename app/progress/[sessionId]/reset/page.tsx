import { getInterviewSessionDetail } from '@/utils/services/interviewSession';
import { Ellipsis } from 'lucide-react';
import ResetButtons from './_client';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  const data = await getInterviewSessionDetail(sessionId);

  if (data && data.status !== 'in_progress') {
    redirect(`/progress/${sessionId}`);
  }

  return (
    <>
      <main className="main">
        <div className="guide">
          <div className="guideIcon">
            <Ellipsis color="var(--neutral-5)" size={60} />
          </div>
          <p className="guideTitle">진행 중이던 면접 세션입니다.</p>
          <p className="guideDesc">
            초기화를 원하시면 초기화를, 종료를 원하시면 종료를 눌러주세요.
          </p>
          <div className="buttons">
            <ResetButtons
              sessionId={sessionId}
              redirectTo={`/progress/${sessionId}`}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
