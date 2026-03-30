import { ThemeProvider } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SignOutButtonClient from "@/components/dashboard/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("role, hotel_id, first_name")
    .eq("id", user.id)
    .single();

  const hotelId = userData?.hotel_id ?? null;

  const { data: hotel } = hotelId
    ? await supabase
        .from("hotels")
        .select("name")
        .eq("id", hotelId)
        .single()
    : { data: null };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/early_room.png"
                  alt="earlyroom"
                  width={24}
                  height={24}
                />
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  earlyroom
                </span>
              </Link>
              <span className="text-neutral-300 dark:text-neutral-600">/</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {hotel?.name ?? ""}
              </span>
              <Link
                href="/dashboard/housekeeper"
                className="text-sm text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Housekeeper view
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {userData?.first_name ?? user.email}
              </span>
              <SignOutButtonClient />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
