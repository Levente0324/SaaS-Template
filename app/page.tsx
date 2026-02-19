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
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/login"
          >
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Launch Your AI SaaS in Minutes
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Production-ready template with Next.js 14, Supabase, Stripe,
                  and Gemini AI. Secure, scalable, and built for speed.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-700"
                  href="/login?mode=signup"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                  href="/login"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">AI Powered</h2>
                <p className="text-center text-gray-500">
                  Integrated with Google Gemini for fast, cost-effective generic
                  text generation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Enterprise Security</h2>
                <p className="text-center text-gray-500">
                  Authentication, middleware protection, and server-side secret
                  management out of the box.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="p-2 bg-black rounded-full text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Subscription Ready</h2>
                <p className="text-center text-gray-500">
                  Full Stripe integration with webhook handling, portals, and
                  plan management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 AI SaaS Starter. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
