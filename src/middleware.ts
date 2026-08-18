import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

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
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};
