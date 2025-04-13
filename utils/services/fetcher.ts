export const fetcher = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options);

  if (!res.ok) throw new Error('API Error');

  return res.json();
};
