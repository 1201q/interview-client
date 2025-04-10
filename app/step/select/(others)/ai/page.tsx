import { cookies } from 'next/headers';
import NeedLogin from '../need-login';

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }

  return <></>;
};

export default Page;
