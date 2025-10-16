import { cookies } from 'next/headers';

export async function getAuth() {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/profile', {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });

  if (!res.ok) {
    return { user: null };
  }

  const user = (await res.json()) as {
    id: string;
    email: string;
    name: string;
  };

  return { user };
}
