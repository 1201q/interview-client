import { RequestSideSteps } from '@/components/newRequest/RequestSideSteps';

import BottomUser from '@/components/sidebar/BottomUser';
import SharedMenu from '@/components/sidebar/SharedMenu';
import SidebarBg from '@/components/sidebar/SidebarBg';
import TopLogo from '@/components/sidebar/TopLogo';

import { cookies } from 'next/headers';

export default async function DefaultSidebar() {
  const sidebarSizeCookie = (await cookies()).get('sidebar-size')?.value as
    | 'mini'
    | 'expanded'
    | undefined;

  const sidebarSize = sidebarSizeCookie ? sidebarSizeCookie : 'expanded';

  return (
    <SidebarBg>
      <TopLogo toggleState={sidebarSize} />
      <SharedMenu />
      <RequestSideSteps />
      <BottomUser />
    </SidebarBg>
  );
}
