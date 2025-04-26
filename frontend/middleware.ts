import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths: string[] = [
  '/dashboard',
  '/profile',
  '/courses',
  '/learning',
  // Add other protected routes here
];

// Paths that are accessible only to non-authenticated users
const authPaths: string[] = [
  '/login',
  '/register',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  
  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if the path is for non-authenticated users only
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Redirect unauthenticated users to login
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - Static files (images, media, etc.)
     * - _next paths (Next.js internal paths)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|images|media|favicon.ico).*)',
  ],
};