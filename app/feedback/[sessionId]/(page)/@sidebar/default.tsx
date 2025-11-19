import FeedbackSidebar from '@/components/sidebar/FeedbackSidebar';
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

  const sidebarSizeCookie = (await cookies()).get('sidebar-size')?.value as
    | 'mini'
    | 'expanded'
    | undefined;

  const sidebarSize = sidebarSizeCookie ? sidebarSizeCookie : 'expanded';

  let data: Awaited<ReturnType<typeof getAnalyesStatuses>>;

  try {
    data = await getAnalyesStatuses(sessionId);

    return (
      <SidebarBg>
        <TopLogo toggleState={sidebarSize} />
        <SharedMenu />
        <FeedbackSidebar data={data} />
        <BottomUser />
      </SidebarBg>
    );
  } catch (error) {
    return (
      <SidebarBg>
        <TopLogo toggleState={sidebarSize} />
        <SharedMenu />
        <div style={{ height: '100%' }}></div>
        <BottomUser />
      </SidebarBg>
    );
  }
}
