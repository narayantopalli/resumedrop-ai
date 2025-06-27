import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: req.headers,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Handle password reset tokens if present
    const { searchParams } = req.nextUrl;
    const code = searchParams.get('code');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');

    if (code) {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);
    } else if (accessToken && refreshToken && type === 'recovery') {
      // Set session from tokens
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    // Get the current session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware session error:', error);
    }

    const { pathname } = req.nextUrl;

    // Define valid routes
    const validRoutes = [
      '/',
      '/home',
      '/upload',
      '/settings',
      '/sign-in',
      '/sign-up',
      '/privacy',
      '/terms',
      '/forgot-password',
      '/reset-password',
      '/auth/callback',
      '/favicon.ico'
    ];

    // Define protected routes that require authentication
    const protectedRoutes = ['/settings'];

    // Define routes that should be blocked for unauthenticated users
    const blockedRoutes = ['/_next'];
    
    // Define auth routes that should redirect authenticated users
    const authRoutes = ['/sign-in', '/sign-up', '/forgot-password'];

    // Allow API routes to pass through
    if (pathname.startsWith('/api')) {
      return response;
    }

    // Check if the current path is a valid route
    const isValidRoute = validRoutes.some(route => pathname === route)

    // Handle blocked routes - redirect unauthenticated users to sign-in
    if (blockedRoutes.some(route => pathname.startsWith(route))) {
      // For authenticated users, allow access
      return NextResponse.redirect(new URL('/home', req.url));
    }

    // If it's not a valid route, redirect based on authentication status
    if (!isValidRoute) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // If accessing a protected route without authentication, redirect to sign-in
    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // If accessing an auth route while authenticated, redirect to home
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    // Handle root path redirect based on authentication status
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Return the request as-is if there's an error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - public folder
     */
    '/((?!_next/static|_next/image|public).*)',
  ],
}; 