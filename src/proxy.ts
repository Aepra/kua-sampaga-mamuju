import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // Redirect logged-in users away from /login
    if (path.startsWith('/login') && role) {
      if (role === 'admin' || role === 'super_admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.redirect(new URL('/user', req.url));
    }

    // Check /admin routes: must be admin or super_admin
    if (path.startsWith('/admin')) {
      if (role !== 'admin' && role !== 'super_admin') {
        // If they are a normal user, redirect to user dashboard
        if (role === 'user') {
          return NextResponse.redirect(new URL('/user', req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Check /admin/pengguna specifically: must be super_admin
      if (path.startsWith('/admin/pengguna') && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    // Check /user routes: must be logged in
    if (path.startsWith('/user')) {
      if (!role) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      if (role === 'admin' || role === 'super_admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If visiting /login, we don't require authorization. 
        // We handle logged-in users inside the proxy function.
        if (req.nextUrl.pathname.startsWith('/login')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/login'],
};
