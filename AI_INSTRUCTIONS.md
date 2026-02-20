# 🤖 AI Agent Instructions

**MISSION:** You are an expert AI software engineer. Your goal is to transform this production-ready SaaS template into the user's specific business idea using **surgical precision**.

**CRITICAL PRIORITY:** DO NOT BREAK THE SECURITY OR ARCHITECTURE.
This template is already audited, secure, and production-ready. You are here to change the _content_ and the _style_, not the _plumbing_.

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

### 1. The "Brain" (Business Logic)

- **Target:** `lib/ai/run-tool.ts`
- **Action:**
  1.  **RENAME** the tool in `TOOL_REGISTRY` to match the business idea (e.g., `generate_recipe` instead of `demo`).
  2.  **REWRITE** the `prompt` string. This is the most important part. Make it extremely specific (e.g., "You are a Michelin-star chef...").
  3.  **UPDATE** the `schema` (Zod) to match the user's input fields.

### 2. The "Skin" (Design & Copy)

- **Target:** `app/page.tsx` (Landing Page)
  - **Rule:** Use "Premium" design tokens.
  - **Gradients:** Use subtle, rich gradients (e.g., `bg-gradient-to-r from-blue-600 to-violet-600`).
  - **Glassmorphism:** Use `backdrop-blur-md bg-white/10 border-white/10` for cards.
  - **Typography:** Maintain the `Inter` font but use tight tracking (`tracking-tight`) for headings.
- **Target:** `app/dashboard/page.tsx` (App Interface)
  - **Action:** enhance the form to accept the inputs defined in Step 1.

### 3. The Database (Optional)

- **Target:** `supabase/migrations/`
- **Action:** If the user needs to save data (e.g., "Saved Recipes"):
  1.  Create a NEW migration file (e.g., `002_recipes.sql`). The core schema is already in `001_schema.sql`.
  2.  Define the table.
  3.  **MANDATORY:** Enable RLS (`ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;`).
  4.  **MANDATORY:** Add a policy (`CREATE POLICY "Users can see own data" ON recipes ...`).

## 📝 The "One-Prompt" Structure

If the user gives you a prompt like "Make this a Dog Walking App", do this:

1.  **Analyze:** Identify the core utility (e.g., "Generate walking routes").
2.  **Modify `lib/ai/run-tool.ts`:** Update the prompt to generate walking routes.
3.  **Modify `app/page.tsx`:** Change "AI SaaS Starter" to "PuppyPaths - AI Dog Routes".
4.  **Modify `app/dashboard/page.tsx`:** Add inputs for "Dog Breed" and "Walk Duration".
5.  **Stop:** Do not rewrite the auth system. Do not change the payment logic.

## 🎨 Premium Design Guidelines (For AI Implementation)

When the user asks for "Premium Design", apply these Tailwind classes:

- **Buttons:** `rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95`
- **Cards:** `rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm`
- **Text:** `text-gray-900 dark:text-white` for headings, `text-gray-500 dark:text-gray-400` for body.

**Final Check:**

- Did I break strict mode? (No `any` types allowed).
- Did I hardcode an API key? (Never. Use `env.GEMINI_API_KEY`).
- Did I bypass RLS? (Never. Always use `createClient`).
