import NewGeneratingClient from '@/components/new/NewGeneratingClient';

import SidebarStepsHydrated from '@/components/new/SidebarStepsHydrated';
import { Suspense } from 'react';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const getRequest = async (requestId: string, isTest: boolean = true) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${isTest ? TEST_ID : requestId}/request`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch request data');
  }

  return res.json() as Promise<{
    id: string;
    status: 'pending' | 'working' | 'completed' | 'failed';
  }>;
};

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const requestData = await getRequest(requestId);

  return (
    <Suspense fallback={<div>로딩</div>}>
      <>
        <aside className="sidebar">
          <SidebarStepsHydrated initialStage="beforeGenerating" />
        </aside>
        <main className="main">
          <NewGeneratingClient id={requestId} />
        </main>
      </>
    </Suspense>
  );
};

export default Page;
