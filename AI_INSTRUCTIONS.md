# 🤖 AI Agent Instructions

**MISSION:** You are an expert AI software engineer. Your goal is to transform this production-ready SaaS template into the user's specific business idea using **surgical precision** and **cinematic front-end design**.

**CRITICAL PRIORITY:** DO NOT BREAK THE SECURITY OR ARCHITECTURE.
This template is already audited, secure, and production-ready. You are here to change the _content_, the _style_, and the _AI payload structure_, not the _plumbing_.

## 🚀 AI Agent Onboarding

1.  **Check for `node_modules`:** If they are missing, the user has likely just unzipped this project. **Immediately** prompt the user to run `npm install` or offer to run it yourself.
2.  **Environment Variables:** Check for `.env.local`. If missing, tell the user to create it from `.env.example`.
3.  **Read the Guides:** Ensure you understand the specific design tokens and transformation rules below.

**NEVER MODIFY OR DELETE THESE FILES unless explicitly asked to fix a bug:**

1.  `lib/auth/**`: Authentication logic is critical.
2.  `lib/billing/**`: Stripe integration is verified.
3.  `app/api/stripe/webhook/route.ts`: Highly optimized handler. Do not touch.
4.  `app/dashboard/billing/_components/buttons.tsx`: Do not change the `window.location.assign` or timeout logic here. It prevents embedded browser deadlocks.
5.  `lib/rate-limit/**`: Protects the API from abuse.
6.  `lib/env.ts`: Enforces environment variable safety.
7.  `middleware.ts`: Handles session security.
8.  `next.config.js`: Contains security headers.

## 🛠️ The "Transformation Zone" (Where you work)

### 1. The "Brain" (Business Logic mapping JSON payloads)

- **Target:** `lib/ai/run-tool.ts`
- **Action:**
  1.  **RENAME** the tool in `TOOL_REGISTRY` to match the business idea (e.g., `generate_recipe` instead of `demo`).
  2.  **REWRITE** the `prompt` string. Make it extremely specific concerning what the AI should output.
  3.  **UPDATE** the `schema` (Zod) to match the exact JSON object the frontend form will send (e.g., `schema: z.object({ age: z.number(), goal: z.string() })`).
  4.  **IMAGE GENERATION:** If the prompt requires an Image Generator (e.g. Nano Banana, Replicate), `npm install` their SDK and update `runAITool`'s Step 7 to return `{ success: true, imageUrl: "..." }`. **CRITICAL SECURITY:** Never overwrite Steps 1-6 (Kill Switch, Validation, Billing, Rate Limits) when installing an Image SDK. Only alter Step 7. The frontend `app/dashboard/page.tsx` natively handles the `imageUrl` property by rendering a cinematic image block automatically.

### 2. The "Skin" (Cinematic UI/UX)

- **Target:** `app/page.tsx`, `app/(public)/login/page.tsx`, `app/dashboard/page.tsx`, `app/dashboard/layout.tsx`
- **Action:** Apply the chosen Aesthetic Preset globally. Eradicate plain "basic white" utility backgrounds.
- **Rule:** Use pre-installed `gsap` for all entrance animations (`power3.out`). Do not install framer-motion.
- **Form Mapping:** In `app/dashboard/page.tsx`, build a premium form collecting the inputs you defined in the Zod schema. Update the fetch block to send exact JSON: `body: JSON.stringify({ toolName: "your_tool", input: { your: "data" } })`

### 3. The Database (Optional)

- **Target:** `supabase/migrations/`
- **Action:** If the user needs to save data (e.g., "Saved Recipes"):
  1.  Create a NEW migration file (e.g., `002_recipes.sql`). The core schema is already in `001_schema.sql`.
  2.  Define the table.
  3.  **MANDATORY:** Enable RLS (`ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;`).
  4.  **MANDATORY:** Add exact policies:
      `CREATE POLICY "select_own" ON recipes FOR SELECT USING (auth.uid() = user_id);`
      `CREATE POLICY "insert_own" ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);`

## 🎨 Cinematic Design Guidelines

When transforming the frontend, apply these rules:

- **Never use plain backgrounds.** Use specific hex-code background variables across the body, layout, and nav.
- **Containers:** Use `rounded-[2rem]` to `rounded-[3rem]`. No sharp corners anywhere.
- **Buttons:** `rounded-full shadow-lg hover:scale-[1.03] transition-transform`
- **Animations:** Use `gsap.context()` for staggering list entries on the Dashboard.

**Final Check:**

- Did I break strict mode?
- Did I hardcode an API key? (Never. Use `env.GEMINI_API_KEY`).
- Did I bypass RLS? (Never.)
- Did I leave the Dashboard background plain white? (Never.)
