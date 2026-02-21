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

const isBuildPhase =
  process.env.npm_lifecycle_event === "build" ||
  process.env.NEXT_PHASE === "phase-production-build";

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 4),
  );

  if (!isBuildPhase) {
    // Throwing ensures the app crashes on start so the developer knows to fix the .env file
    throw new Error("Invalid environment variables");
  } else {
    console.warn(
      "⚠️ Skipping environment validation during build phase to prevent CI/CD crashes.",
    );
  }
}

// Export parsed data safely, fallback to process.env during build phase to prevent TS crashes
export const env = parsed.success ? parsed.data : (process.env as any);
