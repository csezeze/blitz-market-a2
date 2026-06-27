"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const { t } = useLocale();

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="font-display text-3xl uppercase">
        Blitz<span className="text-gradient">Market</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm font-bold text-paper/70">
        <LanguageToggle />
        <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/wallet">
          {t("navWallet")}
        </Link>
        <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/orders">
          {t("navOrders")}
        </Link>
        <Link className="hidden rounded-full px-3 py-2 hover:bg-white/10 sm:inline-block" href="/dashboard">
          {t("navDashboard")}
        </Link>
      </nav>
    </header>
  );
}
