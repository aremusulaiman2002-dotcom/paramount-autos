import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Middleware logic if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all admin routes except login
        if (req.nextUrl.pathname.startsWith('/admin') && 
            !req.nextUrl.pathname.includes('/admin/login')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};