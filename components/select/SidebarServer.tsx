import SidebarClient from './SidebarClient';

const SidebarServer = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oracledb/count`);
  const res: Record<string, number> = await data.json();

  return <SidebarClient count={res} />;
};

export default SidebarServer;
