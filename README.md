# 🚀 AntiGravity AI SaaS Template

**Build your AI startup in minutes, not months.**

> [!IMPORTANT]
> **IF YOU JUST DOWNLOADED THIS ZIP:** You must run `npm install` in your terminal to install the necessary libraries before the app will work.

This is a **production-ready, security-audited** foundation for building AI SaaS applications. All the "boring" code (Auth, Payments, Security, Database) is done, verified, and locked in.

## 📚 Documentation (Start Here)

- **[COMPREHENSIVE_GUIDE.md](./COMPREHENSIVE_GUIDE.md):** The Master Manual. Read this to understand how the project works.
- **[AI_PROMPT.txt](./AI_PROMPT.txt):** The "Magic Prompt". Copy-paste this to an AI to build your app instantly.
- **[AI_INSTRUCTIONS.md](./AI_INSTRUCTIONS.md):** Technical rules for AI agents (don't touch this, but let the AI read it).

## ⚡ Quick Start ( The "One-Prompt" Method )

1.  **Clone this repo.**
2.  **Set up your keys** (see below).
3.  **Open `AI_PROMPT.txt`**, add your idea, and give it to an AI.
4.  **Deploy.**

## 🌟 Security Guarantees (Don't Touch!)

This template comes with baked-in protection. **Do not modify these systems unless you are an expert:**

- **Authentication:** `lib/auth` (Supabase Auth with RLS).
- **Payments:** `lib/billing` (Stripe subscription logic).
- **Safety:** `lib/env.ts` (Validates all API keys on startup).
- **Rate Limiting:** `lib/rate-limit` (Protects your API cost).

## 🛠️ Prerequisites

Before you start, ensure you have accounts for:

1.  **[Supabase](https://supabase.com):**
    - Create a new project.
    - Go to **Project Settings > API** to find your URL and Keys.
    - **CRITICAL:** Go to **SQL Editor**, copy the contents of `supabase/migrations/001_initial_schema.sql` and `002_add_usage_logs_index.sql`, and run them to set up your database.
2.  **[Stripe](https://stripe.com):**
    - Create a new account/project.
    - Create a **Product** (e.g., "Pro Plan") and copy its **Price ID** (starts with `price_`).
    - Go to **Developers > API keys** to get your Secret Key.
    - (Local Development): Use the Stripe CLI to listen for webhooks and get a `whsec_` secret.
3.  **[Google AI Studio](https://aistudio.google.com/):**
    - Get an API key.
4.  **[Node.js](https://nodejs.org/):** Version 18+ installed locally.

## 🚀 Getting Started

### 🤖 For AI Agents

If you are an AI assistant reading this, please refer to [AI_INSTRUCTIONS.md](./AI_INSTRUCTIONS.md) for architectural guidelines and modification rules.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd saas-template
npm install
```

### 2. Configure Environment Variables (CRITICAL)

This app **will not start** without these keys. This is a security feature.

1.  Copy the example file: `cp .env.example .env.local`
2.  Fill in the keys in `.env.local`:

| Variable                        | Where to find it                                                      |
| :------------------------------ | :-------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase > Project Settings > API                                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API                                     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase > Project Settings > API (**Keep Secret!**)                  |
| `STRIPE_SECRET_KEY`             | Stripe > Developers > API Keys                                        |
| `STRIPE_WEBHOOK_SECRET`         | Stripe > Developers > Webhooks                                        |
| `STRIPE_PRICE_ID`               | Stripe > Product Catalog > Click a product > pricing ID (`price_...`) |
| `GEMINI_API_KEY`                | Google AI Studio > Get API Key                                        |

### 3. Setup Database (One-Click)

1.  Go to your **Supabase Dashboard** > **SQL Editor**.
2.  Click **"New Query"**.
3.  Copy the contents of `supabase/migrations/001_initial_schema.sql`.
4.  Run it.
5.  Repeat for `supabase/migrations/002_add_usage_logs_index.sql`.
    **(Do not skip this. Your app needs these tables to function.)**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 🎨 Customizing Your SaaS

### 🤖 Changing the AI Tool

Navigate to `lib/ai/run-tool.ts`.
This is where the "Brain" lives.

1.  Modify `TOOL_REGISTRY` to define your new tool (e.g., "blog-generator", "legal-analyzer").
2.  Update the `prompt` to give Gemini instructions for your specific task.
3.  Update the `schema` (Zod) to validate the input your tool expects.

### 💳 Updates Subscription Plans

1.  Create new products in Stripe.
2.  Update `.env.local` with the new Price IDs.
3.  Update `lib/billing/helpers.ts` if you need custom logic for different plans (e.g. usage limits per plan).

### 💅 Updating the UI

- **Landing Page:** Edit `app/page.tsx` to sell your specific solution.
- **Dashboard:** Edit `app/dashboard/page.tsx` to confirm successful login/payment.
- **Styling:** Edit `app/globals.css` or `tailwind.config.ts` to change the theme.

## 🔒 Security & Production Readiness

This template includes built-in security features:

- **Rate Limiting:** Prevents abuse of your AI API (see `lib/rate-limit`).
- **Input Validation:** All API inputs are validated with Zod.
- **Strict Env:** The app will crash if any required environment variable is missing (fail-fast).

## 📦 Deployment

The easiest way to deploy is [Vercel](https://vercel.com).

1.  Import your GitHub repo to Vercel.
2.  Add your Environment Variables in the Vercel Project Settings.
3.  Deploy!
