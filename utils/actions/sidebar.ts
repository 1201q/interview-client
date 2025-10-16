'use server';

import { cookies } from 'next/headers';

export async function setSidebarSize(size: 'expanded' | 'mini') {
  (await cookies()).set('sidebar-size', size, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
}
