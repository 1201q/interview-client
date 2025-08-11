export const getEphemeralToken = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/transcribe/realtime/token`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('토큰 획득 실패');
  }

  const { client_secret } = (await response.json()) as {
    client_secret: { value: string; expires_at: number };
  };

  return client_secret;
};
