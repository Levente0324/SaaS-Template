/**
 * lib/supabase/server.ts
 * Server-side Supabase client for Server Components, Route Handlers, and Server Actions.
 * Uses cookies() from next/headers to maintain session state.
 * SECURITY: This file may use SUPABASE_SERVICE_ROLE_KEY — server only.
 */
import {
  type SupabaseClient,
  createClient as createSupabaseClient,
} from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Standard server client using the anon key + cookie session */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from Server Component — cookies cannot be set.
            // Session refresh will be handled by middleware.
          }
        },
      },
    },
  ) as SupabaseClient;
}

/**
 * Admin client using the service role key.
 * ONLY use server-side for webhook handlers and privileged operations.
 * NEVER expose this to the client. Uses pure supabase-js to prevent
 * cookie-based JWTs from downgrading the service_role permissions.
 */
export async function createAdminClient(): Promise<SupabaseClient> {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
