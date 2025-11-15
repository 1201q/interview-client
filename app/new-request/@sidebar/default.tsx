import RequestSideStepsHydrated from '@/components/newRequest/RequestSideStepsHydrated';

import BottomUser from '@/components/sidebar/BottomUser';
import SharedMenu from '@/components/sidebar/SharedMenu';
import SidebarBg from '@/components/sidebar/SidebarBg';
import TopLogo from '@/components/sidebar/TopLogo';

import { cookies } from 'next/headers';

export default async function DefaultSidebar({
  params,
}: {
  params: { sessionId: string; answerId: string };
}) {
  const sidebarSizeCookie = (await cookies()).get('sidebar-size')?.value as
    | 'mini'
    | 'expanded'
    | undefined;

  const sidebarSize = sidebarSizeCookie ? sidebarSizeCookie : 'expanded';

  return (
    <SidebarBg>
      <TopLogo toggleState={sidebarSize} />
      <SharedMenu />
      <RequestSideStepsHydrated
        initialStage="resumeText"
        dangerouslyForceHydrate={false}
      />
      <BottomUser />
    </SidebarBg>
  );
}
