import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Set BYPASS_AUTH=true in .env.local to skip auth guard during development
  if (process.env.BYPASS_AUTH === 'true') return NextResponse.next();

  // Cookie name must match what the server sets (HTTPOnly)
  const token = request.cookies.get('auth-token')?.value;

  const isProtected = pathname.startsWith('/dashboard');
  const isAuthPage  = pathname === '/login' || pathname === '/register';

  // Redirect unauthenticated users away from dashboard
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
