'use server';

import { cookies } from 'next/headers';

export const hasAccessToken = async () => {
  const token = (await cookies()).has('accessToken');

  return token;
};
