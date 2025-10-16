'use server';
import { cookies } from 'next/headers';

export const logout = async (refreshToken: string) => {
  'use server';

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

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
