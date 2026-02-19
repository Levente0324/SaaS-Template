/**
 * lib/auth/helpers.ts
 * Auth helper functions for server-side use only.
 *
 * getCurrentUser() — returns the authenticated user or null.
 * requireUser()    — throws an AppError if user is not authenticated.
 *
 * Use these in Route Handlers, Server Components, and Server Actions.
 * Never call from client-side code.
 */
import type { AuthUser as User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { Errors } from "@/lib/errors";
import type { Profile } from "@/types";

/**
 * Returns the currently authenticated user, or null if not logged in.
 * Session is refreshed automatically via middleware.
 */
/**
 * Returns the currently authenticated user, or null if not logged in.
 * Session is refreshed automatically via middleware.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Returns the authenticated user or throws UNAUTHORIZED.
 * Use at the top of any protected Route Handler or Server Action.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw Errors.unauthorized();
  }
  return user;
}

/**
 * Fetches the user's profile from the profiles table.
 * Uses the standard client (respects RLS).
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}
