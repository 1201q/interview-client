import SidebarBg from '@/components/sidebar/SidebarBg';
import './layout.css';

import { Suspense } from 'react';
import TopLogo from '@/components/sidebar/TopLogo';
import InterviewSidebar from '@/components/interview-progress/InterviewSidebar';
import { cookies } from 'next/headers';
import {
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';
import InterviewProvider, {
  InterviewInitial,
} from '@/components/interview-progress/InterviewProvider';

type SessionDetailResponse = {
  session_id: string;
  status: InterviewSessionStatus;
  created_at: string;
  questions: SessionQuestionItemWithAnswerId[];
};

const getSession = async (sessionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch request data');
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

  const sidebarSizeCookie = (await cookies()).get('sidebar-size')?.value as
    | 'mini'
    | 'expanded'
    | undefined;

  const sidebarSize = sidebarSizeCookie ? sidebarSizeCookie : 'expanded';

  const data = await getSession(sessionId);

  const initialData: InterviewInitial = {
    sessionId: data.session_id,
    status: data.status,
    questions: data.questions,
  };

  return (
    <InterviewProvider initialData={initialData}>
      <div className="container">
        <div className="wrapper">
          <aside className="sidebar">
            <Suspense fallback={<div>Loading…</div>}>
              <SidebarBg>
                <TopLogo toggleState={sidebarSize} />
                <InterviewSidebar />
              </SidebarBg>
            </Suspense>
          </aside>
          <main className="main">{children}</main>
        </div>
      </div>
    </InterviewProvider>
  );
}
