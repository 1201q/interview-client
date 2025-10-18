import FeedbackSidebar from '@/components/result/FeedbackSidebar';
import BottomUser from '@/components/sidebar/BottomUser';
import SharedMenu from '@/components/sidebar/SharedMenu';
import SidebarBg from '@/components/sidebar/SidebarBg';
import TopLogo from '@/components/sidebar/TopLogo';
import { getAnalyesStatuses } from '@/utils/services/analyses';
import { cookies } from 'next/headers';

export default async function DefaultSidebar({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const statuses = await getAnalyesStatuses(sessionId);

  const sidebarSizeCookie = (await cookies()).get('sidebar-size')?.value as
    | 'mini'
    | 'expanded'
    | undefined;

  const sidebarSize = sidebarSizeCookie ? sidebarSizeCookie : 'expanded';

  return (
    <SidebarBg>
      <TopLogo toggleState={sidebarSize} />
      <SharedMenu />
      <FeedbackSidebar data={statuses} />
      <BottomUser />
    </SidebarBg>
  );
}
