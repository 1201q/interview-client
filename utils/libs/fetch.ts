import 'server-only';
import { cookies } from 'next/headers';

type TimeoutOpts = {
  timeoutMs?: number;
  revalidateSec?: number; // 캐싱 시간
  withCookie?: boolean;
};

export async function fetchWithTimeout<T>(
  path: string,
  opts: TimeoutOpts = {},
): Promise<T> {
  const controller = new AbortController();

  // 타임아웃 설정
  const timeout = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 15000,
  );

  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (opts.withCookie) {
      const cookieHeader = (await cookies()).toString();
      (headers as any).cookie = cookieHeader;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      method: 'GET',
      headers,
      signal: controller.signal,
      next:
        typeof opts.revalidateSec === 'number'
          ? { revalidate: opts.revalidateSec }
          : undefined,
    });

    if (!res.ok) {
      let body = '';

      try {
        body = await res.text();
      } catch {
        //
      }

      const err = new Error(`fetch 실패: ${res.status} ${body}`);
      (err as any).status = res.status;
      throw err;
    }

    return (await res.json()) as T;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
