import './layout.css';

import { getAnalyesStatuses } from '@/utils/services/analyses';
import { Suspense } from 'react';

export default async function Layout({
  children,
  params,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;

  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const statuses = await getAnalyesStatuses(sessionId);

  return (
    <div className="container">
      <div className="wrapper">
        <aside className="sidebar">
          <Suspense fallback={<div>Loading…</div>}>{sidebar ?? null}</Suspense>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
