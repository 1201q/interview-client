import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import AiPageServer from '@/components/select/AiPageServer';

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }

  return <AiPageServer />;
};

export default Page;
