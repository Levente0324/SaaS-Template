import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AI SaaS Starter",
    template: "%s | AI SaaS Starter",
  },
  description:
    "Production-ready AI SaaS Template with Supabase, Stripe, and Gemini.",
  keywords: ["AI", "SaaS", "Template", "Next.js", "Supabase", "Stripe"],
  authors: [{ name: "SaaS Team" }],
  openGraph: {
    title: "AI SaaS Starter",
    description: "Launch your AI startup in minutes.",
    url: appUrl,
    siteName: "AI SaaS Starter",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI SaaS Starter",
    description: "Production-ready AI SaaS Template",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
