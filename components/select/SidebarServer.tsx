import { headers } from 'next/headers';
import SidebarClient from './SidebarClient';

const SidebarServer = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oracledb/count`);
  const res: Record<string, number> = await data.json();
  const header = await headers();
  const role = header.get('x-role') || 'fe';

  return <SidebarClient count={res} role={role} />;
};

export default SidebarServer;
