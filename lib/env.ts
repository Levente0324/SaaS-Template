import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),

  // AI
  GEMINI_API_KEY: z.string().min(1),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Config
  MAX_DAILY_USAGE_PER_USER: z.string().optional().default("10"),
  AI_REQUEST_TIMEOUT_MS: z.string().optional().default("30000"),
  DISABLE_AI_FEATURES: z.enum(["true", "false"]).optional().default("false"),

  // Environment
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// Validate process.env
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errorMsg = `❌ Invalid environment variables: ${JSON.stringify(
    parsed.error.format(),
    null,
    4,
  )}`;
  console.error(errorMsg);
  // Throwing ensures the app crashes on start, even in Edge runtime
  throw new Error(errorMsg);
}

export const env = parsed.data;
