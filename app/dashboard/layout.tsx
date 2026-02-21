import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/helpers";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, CreditCard, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await (supabase.auth as any).signOut();
    redirect("/login");
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">AI SaaS Starter</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>AI Tool</span>
          </Link>

          <Link
            href="/dashboard/billing"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CreditCard size={20} />
            <span>Billing</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm text-foreground/70 px-2">
              {user.email}
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
