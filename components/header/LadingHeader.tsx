import styles from './styles/landngHeader.module.css';
import { cookies } from 'next/headers';

import HeaderController from './HeaderController';

const LandingHeader = async () => {
  const refreshToken = (await cookies()).get('refreshToken')?.value;
  const accessToken = (await cookies()).get('accessToken')?.value;

  const logout = async () => {
    'use server';

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',

          headers: {
            'Content-Type': 'application/json',
            Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          },
        },
      );

      console.log(response);

      if (!response.ok) {
        throw new Error('로그아웃에 실패했습니다.');
      }

      (await cookies()).delete({
        name: 'accessToken',
        domain: process.env.NEXT_PUBLIC_URL
          ? `.${new URL(process.env.NEXT_PUBLIC_URL).hostname}`
          : '',
      });
      (await cookies()).delete({
        name: 'refreshToken',
        domain: process.env.NEXT_PUBLIC_URL
          ? `.${new URL(process.env.NEXT_PUBLIC_URL).hostname}`
          : '',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <p className={styles.logo}>AiTerview</p>
        <HeaderController logout={logout} token={accessToken} />
      </div>
    </div>
  );
};

export default LandingHeader;
