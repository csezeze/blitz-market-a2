"use client";

import { useLocale } from "@/lib/i18n";

export function WalletIntro() {
  const { t } = useLocale();

  return (
    <div className="mb-6">
      <div className="text-xs font-black uppercase tracking-widest text-paper/45">{t("walletEyebrow")}</div>
      <h1 className="font-display text-6xl uppercase text-gradient">{t("walletTitle")}</h1>
      <p className="mt-3 max-w-2xl text-paper/65">{t("walletText")}</p>
    </div>
  );
}

export function OrdersIntro() {
  const { t } = useLocale();

  return (
    <div className="mb-6">
      <div className="text-xs font-black uppercase tracking-widest text-paper/45">{t("ordersEyebrow")}</div>
      <h1 className="font-display text-6xl uppercase text-gradient">{t("ordersTitle")}</h1>
    </div>
  );
}

export function DashboardIntro() {
  const { t } = useLocale();

  const steps = [
    { label: t("stepEarn"), call: "reward(eventId, user)", text: t("stepEarnText") },
    { label: t("stepHold"), call: "balancesOf(user, ids)", text: t("stepHoldText") },
    { label: t("stepSwap"), call: "swap(user, fromId, toId, amount)", text: t("stepSwapText") },
    { label: t("stepSpend"), call: "buy(productId, user, coinId, price)", text: t("stepSpendText") },
    { label: t("stepReceipt"), call: "Purchased event", text: t("stepReceiptText") },
  ];

  return (
    <>
      <div className="mb-6">
        <div className="text-xs font-black uppercase tracking-widest text-paper/45">{t("economyEyebrow")}</div>
        <h1 className="font-display text-6xl uppercase text-gradient">{t("economyTitle")}</h1>
      </div>

      <section className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="panel rounded-2xl p-6">
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">{t("whyMonad")}</div>
          <h2 className="mt-3 text-3xl font-black">{t("economyHeading")}</h2>
          <p className="mt-3 text-paper/68">{t("economyText")}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="font-mono text-xs font-bold text-paper/35">{String(index + 1).padStart(2, "0")}</div>
              <div className="mt-3 text-xl font-black">{step.label}</div>
              <div className="mt-2 break-words font-mono text-[11px] text-sky">{step.call}</div>
              <p className="mt-3 text-sm text-paper/60">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
