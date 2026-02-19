# 📘 The Master Guide: From Template to SaaS

**Welcome.** You have purchased the **AntiGravity AI SaaS Template**.
This guide explains exactly how to turn this code into a profitable, secure business—whether you use AI to build it or code it yourself.

---

## 🏛️ Architecture Overview (How it works)

This app is built like a fortress.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS.
- **The "Brain":** `lib/ai/run-tool.ts`. This is the single entry point for all AI logic.
- **The Guard:** `lib/rate-limit` & `lib/billing`. No one uses your AI without paying or staying within limits.
- **The Vault:** Supabase (PostgreSQL) stores user data with Row Level Security (RLS). A user can _only_ see their own data.

---

## 🤖 The "AI-Only" Path (Easiest)

If you don't want to code, use the included `AI_PROMPT.txt`.

1.  **Open** the file `AI_PROMPT.txt`.
2.  **Replace** the text `[INSERT_YOUR_BUSINESS_IDEA_HERE]` with your idea (e.g., "A Cover Letter Generator").
3.  **Copy** the entire text.
4.  **Paste** it into an AI coding assistant (Cursor, Windsurf, or ChatGPT).
5.  **Watch** it handle the rest.

---

## 👨‍💻 The "Manual" Path (For Developers)

If you want full control, here is where everything lives:

### 1. Where to put your Business Logic

Go to `lib/ai/run-tool.ts`.

- Look for `TOOL_REGISTRY`. This is where you define what your AI does.
- Change the `prompt` string to instruct the AI (e.g., "You are a legal expert...").
- Change the `schema` (Zod) to define what inputs you need (e.g., `contract_text`, `user_question`).

### 2. Where to change the UI

- `app/page.tsx`: The Landing Page. Change the text to sell your product.
- `app/dashboard/page.tsx`: The User Dashboard. This is where users interact with your AI tool.

### 3. How to add new Database Tables

- Go to `supabase/migrations`.
- Create a new file (e.g., `003_tasks.sql`).
- Write standard SQL.
- **CRITICAL:** Always add the line `ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;`.

---

## 🛡️ Safety & Security (READ THIS)

We have pre-configured 5 layers of security. **DO NOT REMOVE THEM.**

1.  **Rate Limiting:** Prevents users from spamming your API and running up your bill.
    - _Config:_ `lib/rate-limit/index.ts`
2.  **Kill Switch:** Instantly disable AI features if something goes wrong.
    - _Config:_ Set `DISABLE_AI_FEATURES=true` in your `.env`.
3.  **Daily Limits:** Users get 10 free generations per day (configurable).
    - _Config:_ `lib/ai/usage.ts`
4.  **Secure Headers:** Protects against XSS and clickjacking.
    - _Config:_ `next.config.js`
5.  **Environment Validation:** App won't start if keys are missing.
    - _Config:_ `lib/env.ts`

---

## 🚀 Deployment Checklist

When you are ready to launch:

1.  [ ] Run `npm run lint` to check for code errors.
2.  [ ] Run `npm run build` to ensure the app compiles.
3.  [ ] Deploy to **Vercel** (recommended).
4.  [ ] Add your **Production Environment Variables** in Vercel.
5.  [ ] In **Stripe**, switch from "Test Mode" to "Live Mode" and copy your live keys.
6.  [ ] In **Supabase**, ensure you are using the production URL.

**Good luck!** You are building on a solid foundation.
