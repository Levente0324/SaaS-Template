/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Responsibilities:
 * 1. Refresh Supabase auth session on every request (keeps tokens alive)
 * 2. Protect all /dashboard/* routes — redirect unauthenticated users to /login
 * 3. Redirect authenticated users away from /login to /dashboard
 *
 * SECURITY: Session validation happens here on every request, not only on page load.
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { type SupabaseClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create a Supabase client that can read/write cookies via middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[],
        ) {
          // Apply cookies to both the request and response so they persist
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  ) as SupabaseClient;

  // IMPORTANT: Do not add logic between this call and the getUser() call.
  // This pattern is required by @supabase/ssr for session refresh to work.
  const {
    data: { user },
  } = await (supabase.auth as any).getUser();

  const { pathname } = request.nextUrl;

  // Protect /dashboard and all sub-routes
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isProtectedRoute && !user) {
    // Unauthenticated: redirect to login with return path
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    // Already logged in: send to dashboard
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
