import LogoutModal from '@/components/modal/LogoutModal';
import { logout } from '@/utils/actions/logout';
import { getAuth } from '@/utils/services/auth';
import { cookies } from 'next/headers';

const Page = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!auth.user || !refreshToken) return null;

  const action = async () => {
    'use server';
    await logout(refreshToken);
  };

  return <LogoutModal email={auth.user.email} action={action} />;
};

export default Page;
