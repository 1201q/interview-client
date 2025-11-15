type TimeoutOpts = {
  timeoutMs?: number;
  withCredentials?: boolean; // 쿠키 포함 전송
};

export async function fetchWithTimeoutClient<T>(
  path: string,
  opts: TimeoutOpts = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      credentials: opts.withCredentials ? 'include' : 'same-origin', // 쿠키 필요 시 include
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err: any = new Error(`fetch 실패: ${res.status} ${body}`);
      err.status = res.status;
      throw err;
    }
    return (await res.json()) as T;
  } catch (e: any) {
    if (e?.name === 'AbortError')
      throw new Error('요청이 시간 초과되었습니다.');
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
