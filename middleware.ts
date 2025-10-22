import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

interface Token {
  exp: number;
  iat: number;
  id: string;
}

type TokenPayload = { exp?: number; iat?: number; id?: string };

// ==================== helpers ====================
// ==================== helpers ====================
// base64UrlDecode 함수
function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const str = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return decodeURIComponent(
    Array.prototype.map
      .call(
        atob(str),
        (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
      )
      .join(''),
  );
}

// JWT 토큰에서 exp 추출 함수
function getJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(
      base64UrlDecode(token.split('.')[1] || ''),
    ) as TokenPayload;
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

// Headers에서 Set-Cookie 헤더를 배열로 반환하는 함수
function getSetCookieArray(headers: Headers): string[] {
  const anyH = headers as unknown as { getSetCookie?: () => string[] };
  if (typeof anyH.getSetCookie === 'function') return anyH.getSetCookie();
  const raw = headers.get('set-cookie');
  if (!raw) return [];

  // Set-Cookie 헤더를 ','로 분리하되, 속성 값에 '='가 있는 경우를 고려
  return raw.split(/,(?=[^ ;]+=)/g).map((s) => s.trim());
}

// ==================== middleware ====================
// ==================== middleware ====================
async function middlewarev1(request: NextRequest) {
  const response = NextResponse.next();
  const role = request.nextUrl.searchParams.get('role');
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  response.headers.set('x-pathname', pathname);

  if (pathname.startsWith('/question_select') && role) {
    response.headers.set('x-role', role);
  }

  // 로그인 유저가 로그인 페이지 접근시 메인으로 리다이렉트
  if (request.cookies.has('accessToken') && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 비로그인 유저가 로그아웃 페이지 접근시 메인으로 리다이렉트
  if (!request.cookies.has('accessToken') && pathname.startsWith('/logout')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    !request.cookies.has('accessToken') &&
    pathname.startsWith('/question_select') &&
    (role === 'user' || role === 'ai' || role === 'bookmark')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken) {
    const decoded = jwt.decode(accessToken.value) as Token;

    if (decoded) {
      // 토큰 만료시간 계산
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn < 300 && refreshToken) {
        console.log(`300초미만 재갱신 시작: ${expiresIn}초`);

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                Cookie: `refreshToken=${refreshToken.value}`,
              },
            },
          );

          console.log('res');
          console.log(res);

          if (res.ok) {
            const responseCookies = new ResponseCookies(res.headers);

            const newAccessToken = responseCookies.get('accessToken');
            const newRefreshToken = responseCookies.get('refreshToken');

            console.log('newAccessToken', newAccessToken);
            console.log('newRefreshToken', newRefreshToken);

            if (newAccessToken) {
              response.cookies.set('accessToken', newAccessToken.value, {
                httpOnly: newAccessToken.httpOnly,
                sameSite: newAccessToken.sameSite,
                path: newAccessToken.path,
                secure: newAccessToken.secure,
                maxAge: newAccessToken.maxAge,
              });
            }
            if (newRefreshToken) {
              response.cookies.set('refreshToken', newRefreshToken.value, {
                httpOnly: newRefreshToken.httpOnly,
                sameSite: newRefreshToken.sameSite,
                path: newRefreshToken.path,
                secure: newRefreshToken.secure,
                maxAge: newRefreshToken.maxAge,
              });
            }
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  response.headers.set('x-pathname', pathname);

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // 로그인 유저가 로그인 페이지 접근시 메인으로 리다이렉트
  if (accessToken && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 비로그인 유저가 로그아웃 페이지 접근시 메인으로 리다이렉트
  if (!accessToken && pathname.startsWith('/logout')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 토큰 만료 임박시 refresh 호출 (pass-through로 쿠키 전달)
  if (accessToken && refreshToken) {
    const exp = getJwtExp(accessToken);

    if (exp) {
      const now = Math.floor(Date.now() / 1000);

      // 300초 미만 => 토큰 재발급
      if (exp - now < 300) {
        try {
          const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              method: 'POST',
              headers: { Cookie: `refreshToken=${refreshToken}` },
            },
          );

          if (refreshResponse.ok) {
            const setSookies = getSetCookieArray(refreshResponse.headers);

            for (const sc of setSookies) {
              console.log(sc);
              response.headers.append('set-Cookie', sc);
            }
          }
        } catch {
          console.error('Error refreshing token');
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // auth
    '/login',
    '/logout',

    // 인증 필요
    '/new-request',
    '/feedback/:path*',
    '/interview/:path*',
    '/result/:id',
  ],
};
