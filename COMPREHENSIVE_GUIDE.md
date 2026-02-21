# 📘 The Master Guide: From Template to SaaS

**Welcome.** You have purchased the **AntiGravity AI SaaS Template**.
This guide explains exactly how to set up your template and turn it into a profitable, secure business in under an hour.

---

## 🏁 Initial Setup (Do this before anything else)

1. **Install Dependencies:** Open a terminal and run `npm install`.
2. **Setup Environment Variables:** Duplicate the `.env.example` file and rename it to `.env.local`. You will paste all your API keys into this new file.
3. **Connect the Database (Supabase):**
   - Create a free project on [Supabase.com](https://supabase.com/).
   - Go to your Project Settings > API, copy the **URL** and **anon key**, and paste them into your `.env.local` file.
   - Click "SQL Editor" on the left menu in Supabase.
   - Open the `supabase/migrations/001_schema.sql` file from this codebase. Copy all the text inside it, paste it into the Supabase SQL Editor, and click **RUN**. This securely creates your tables, Row-Level Security (RLS) policies, and triggers in one click!
4. **Connect Payments (Stripe):**
   - Create a free account on [Stripe.com](https://stripe.com/).
   - Grab your **Publishable key** and **Secret key** from the dashboard and paste them into `.env.local`.
   - In Stripe, create a new "Product" (e.g., Premium Tier) and give it a "Price" (e.g., $9/month). Copy the `price_...` ID and paste it into `STRIPE_PRICE_ID` in your `.env.local`.
   - Generate a Webhook secret in your Stripe dashboard (listening to `checkout.session.completed`, `customer.subscription.*` events) and paste that into `STRIPE_WEBHOOK_SECRET`.

---

## 🏛️ Architecture Overview (How it works)

This app is built like a fortress.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS.
- **The "Brain":** `lib/ai/run-tool.ts`. This is the single entry point for all AI logic.
- **The Guard:** `lib/rate-limit` & `lib/billing`. No one uses your AI without paying or staying within limits.
- **The Vault:** Supabase (PostgreSQL) stores user data securely. RLS ensures users can _only_ see their own data.

---

## 🤖 The "AI-Only" Path (The Cinematic SaaS Builder)

If you don't want to code, use the included `AI_PROMPT.txt` Master Prompt. It has been extensively engineered to force AI agents to build pixel-perfect, secure SaaS products natively handling either **Text Generation** or **Image Generation (Nano Banana, Replicate, etc.)**.

1.  **Open** the file `AI_PROMPT.txt`.
2.  **Copy** the entire text exactly as it is.
3.  **Paste** it into an AI coding assistant (Cursor, Windsurf, or ChatGPT).
4.  **Answer the 8 Questions:** The AI will immediately stop and interview you about your brand, aesthetic preset, pricing, dashboard inputs, and whether you are building a **Text** or **Image Generator**.
5.  **Watch** it surgically execute the 5-Phase Roadmap to build your app natively handling all database schemas, UI redesigns, Image block rendering, and backend AI routing.

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
- Create a new file (e.g., `002_tasks.sql`). (001_schema.sql is the master foundation).
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
3.  [ ] Push to GitHub and deploy to **Vercel** (recommended).
4.  [ ] Add your **Production Environment Variables** in Vercel.
5.  [ ] In **Stripe**, switch from "Test Mode" to "Live Mode", copy your live keys to Vercel, and update the Stripe Webhook URL to point to your live Vercel domain.
6.  [ ] In **Supabase**, ensure your Google Auth settings reflect your final domain.

**Good luck!** You are building on a rock-solid foundation.
