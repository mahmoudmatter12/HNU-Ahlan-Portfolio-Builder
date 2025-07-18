import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  // '/account(.*)',
  // '/settings(.*)',
  // Add more protected routes as needed
]);

// Configure internationalization middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: "always",
  // Optional: domain-based routing if using multiple domains
  // domains: [
  //   {domain: 'example.com', defaultLocale: 'en'},
  //   {domain: 'example.es', defaultLocale: 'es'}
  // ]
});

export default clerkMiddleware(async (auth, req) => {
  const { pathname, searchParams } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  // Skip middleware for API routes if needed
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(
        `/${routing.defaultLocale}${pathname}${
          searchParams ? `?${searchParams}` : ""
        }`,
        req.url
      )
    );
  }

  // Process internationalization
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Handle protected routes
  if (isProtectedRoute(req)) {
    const authResult = await auth();

    // Redirect unauthenticated users
    if (!authResult.userId) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Optional: Check user role or other permissions
    // if (authResult.orgRole !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
  }

  return intlResponse;
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|.*\\..*).*)",
    // Optionally include API routes
    // '/(api|trpc)(.*)',
  ],
};
