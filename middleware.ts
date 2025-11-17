import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function parseJwt(token: string) {
  const payload = token.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

export function middleware(req: NextRequest) {
  let token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  const decoded = parseJwt(token);
  const role = decoded.role;
  const path = req.nextUrl.pathname;

  if (role === 'student') {
    if (!path.startsWith('/student')) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }
  }

  if (role === 'teacher') {
    if (!path.startsWith('/teacher')) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/super-admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
  ],
};
