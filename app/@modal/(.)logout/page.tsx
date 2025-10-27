import LogoutModal from '@/components/modal/LogoutModal';
import { logout } from '@/utils/actions/logout';
import { getAuth } from '@/utils/services/auth';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import ModalLoading from './loading';

const Page = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  if (!auth.user || !refreshToken) return null;

  const action = async () => {
    'use server';
    await logout(refreshToken);
  };

  return (
    <Suspense fallback={<ModalLoading />}>
      <LogoutModal email={auth.user.email} action={action} />
    </Suspense>
  );
};

export default Page;
