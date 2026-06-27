"use client";

import Link from "next/link";
import { ActivityStrip } from "@/components/ActivityStrip";
import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useLocale } from "@/lib/i18n";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export default function Home() {
  const { t } = useLocale();
  const featured = PRODUCTS.filter((product) => product.featured);
  const rest = PRODUCTS.filter((product) => !product.featured);

  return (
    <main>
      <ConnectBar />
      <Header />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-8 pt-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-widest text-paper/70">
            {t("heroEyebrow")}
          </div>
          <h1 className="font-display text-6xl uppercase sm:text-7xl lg:text-8xl">
            {t("heroTitleA")}
            <br />
            <span className="text-gradient">{t("heroTitleB")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium text-paper/68">
            {t("heroText")}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/wallet" className="rounded-full bg-punch px-6 py-3 font-black text-white">
              {t("openWallet")}
            </Link>
            <Link href="/c/tickets" className="rounded-full border border-white/15 px-6 py-3 font-black text-paper">
              {t("shopTickets")}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} featured={product.id === 1} />
          ))}
        </div>
      </section>

      <ActivityStrip />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl uppercase">{t("categories")}</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Link key={category} href={`/c/${category.toLowerCase()}`} className="rounded-full bg-white/7 px-4 py-2 text-sm font-black">
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
