import { RequestSideSteps } from '@/components/newRequest/RequestSideSteps';

import BottomUser from '@/components/sidebar/BottomUser';
import SharedMenu from '@/components/sidebar/SharedMenu';
import SidebarBg from '@/components/sidebar/SidebarBg';
import TopLogo from '@/components/sidebar/TopLogo';

export default async function DefaultSidebar() {
  return (
    <SidebarBg>
      <TopLogo />
      <SharedMenu />
      <RequestSideSteps />
      <BottomUser />
    </SidebarBg>
  );
}
