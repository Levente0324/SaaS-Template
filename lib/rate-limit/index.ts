/**
 * lib/rate-limit/index.ts
 * In-memory sliding window rate limiter (per user, per minute).
 *
 * NOTE: This in-memory implementation works per-process.
 * For multi-replica production deployments (e.g. Vercel, AWS Lambda),
 * this WILL NOT work correctly as state is not shared between instances.
 * REQUIRED: Swap the Map for a Redis/Upstash-backed store.
 *
 * Edge-safe: uses no Node.js-only APIs.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Per-user request tracking (userId → entry)
const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now - entry.windowStart > 120_000) {
      store.delete(key);
    }
  });
}, 300_000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

/**
 * checkRateLimit
 * Sliding window rate limiter: allows `maxRequests` per `windowMs`.
 *
 * @param key         - Unique key (e.g., userId or `${userId}:${route}`)
 * @param maxRequests - Maximum allowed requests per window
 * @param windowMs    - Window duration in milliseconds (default: 60 seconds)
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    // New window: reset counter
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    const resetInMs = windowMs - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetInMs };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInMs: windowMs - (now - entry.windowStart),
  };
}
