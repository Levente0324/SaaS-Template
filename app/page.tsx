import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link
          className="flex items-center justify-center font-bold text-xl"
          href="#"
        >
          AI SaaS Starter
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 text-foreground/80 hover:text-foreground transition-colors"
            href="/login"
          >
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30 transition-colors duration-300">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Launch Your AI SaaS in Minutes
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl">
                  Production-ready template with Next.js 14, Supabase, Stripe,
                  and Gemini AI. Secure, scalable, and built for speed.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none flex-shrink-0"
                  href="/login?mode=signup"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border/50 bg-secondary px-8 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none flex-shrink-0"
                  href="/login"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background transition-colors duration-300">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-border/50 p-6 rounded-xl bg-card transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  AI Powered
                </h2>
                <p className="text-center text-foreground/70">
                  Integrated with Google Gemini for fast, cost-effective generic
                  text generation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border/50 p-6 rounded-xl bg-card transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Enterprise Security
                </h2>
                <p className="text-center text-foreground/70">
                  Authentication, middleware protection, and server-side secret
                  management out of the box.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-border/50 p-6 rounded-xl bg-card transition-colors">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Subscription Ready
                </h2>
                <p className="text-center text-foreground/70">
                  Full Stripe integration with webhook handling, portals, and
                  plan management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/50 bg-background transition-colors">
        <p className="text-xs text-foreground/50">
          © 2024 AI SaaS Starter. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
