import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const role = request.nextUrl.searchParams.get('role');

  response.headers.set('x-pathname', request.nextUrl.pathname);

  if (role) {
    response.headers.set('x-role', role);
  }

  return response;
}

export const config = {
  matcher: '/step/:currentStep',
};
