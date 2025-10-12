import SharedHeader from '@/components/new/Header';
import './layout.css';
import { getAnalyesStatuses } from '@/utils/services/analyses';
import ResultSidebar from '@/components/result/ResultSidebar';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { sessionId: string };
}) {
  const statuses = await getAnalyesStatuses(params.sessionId);

  return (
    <div className="container">
      <header className="header">
        <SharedHeader />
      </header>
      <div className="wrapper">
        <aside className="sidebar">
          <ResultSidebar data={statuses} />
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
