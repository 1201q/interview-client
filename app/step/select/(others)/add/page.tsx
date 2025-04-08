import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import AddPageHeaderClient from '@/components/select/AddPageHeaderClient';
import AddPageListClient from '@/components/select/AddPageListClient';

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }
  return (
    <>
      <AddPageHeaderClient>
        <AddPageListClient />
      </AddPageHeaderClient>
    </>
  );
};

export default Page;
