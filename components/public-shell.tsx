"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const HIDE_NAV_PATHS = ["/dashboard", "/login", "/signup", "/reset-password", "/update-password", "/onboarding"];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav =
    pathname === "/dashboard" ||
    pathname?.startsWith("/dashboard/") ||
    HIDE_NAV_PATHS.some((p) => pathname === p || pathname?.startsWith(p + "/")) ||
    pathname?.startsWith("/onboarding/");

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      {!hideNav && <Footer />}
    </>
  );
}
