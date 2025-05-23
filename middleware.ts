import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';

interface Token {
  exp: number;
  iat: number;
  id: string;
}

export async function middleware(request: NextRequest) {
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

  if (
    !request.cookies.has('accessToken') &&
    pathname.startsWith('/question_select') &&
    (role === 'user' || role === 'ai' || role === 'bookmark')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    !request.cookies.has('accessToken') &&
    (pathname.startsWith('/question_generate') ||
      pathname.startsWith('/question_delete'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (
    !request.cookies.has('accessToken') &&
    pathname.startsWith('/question_select/confirm')
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

export const config = {
  matcher: [
    '/login',
    '/interview',
    '/interview/running',
    '/question_select',
    '/question_select/confirm',
    '/question_add',
    '/device_check',
    '/device_check/camera',
    '/question_delete',
    '/question_generate',
    '/result/:id',
  ],
};
