import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isAdminLogin = req.nextUrl.pathname === "/admin/login";

        // Handle Admin Routes
        if (isAdminRoute) {
            // Exclude exactly the login page from auth blocks
            if (isAdminLogin) {
                // If trying to access admin login while already logged in as admin, redirect to dashboard
                if (token && token.role !== 'user') {
                    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
                }
                // Allow unauthenticated users (or standard users who need to swap accounts) to see the login page
                return NextResponse.next();
            }

            // Standard users should never see admin pages
            if (!token || token.role === 'user') {
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }

            return NextResponse.next();
        }

        // Standard User Dashboard Routes
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
                const isAdminLogin = req.nextUrl.pathname === "/admin/login";

                // Allow public access to the admin login page
                if (isAdminLogin) return true;

                // For all other protected routes (/dashboard, /admin/dashboard), require a token
                return !!token;
            }
        },
        pages: {
            signIn: "/invest/login",
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*" // Protect entire admin branch
    ]
};
