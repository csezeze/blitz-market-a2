"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isAddress } from "viem";
import { EMPTY_BALANCES, type BalanceMap } from "@/lib/balances";
import { shortAddress } from "@/lib/format";
import { getStoredAddress, storeAddress } from "@/lib/identity";
import { useLocale } from "@/lib/i18n";
import { BalanceChips } from "./BalanceChips";

type BalanceResponse = {
  deployed: boolean;
  balances: BalanceMap;
};

export function ConnectBar() {
  const { t } = useLocale();
  const [address, setAddress] = useState<`0x${string}` | "">("");
  const [draft, setDraft] = useState("");
  const [balances, setBalances] = useState<BalanceMap>(EMPTY_BALANCES);
  const [deployed, setDeployed] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const incoming = url.searchParams.get("addr");
    const active = incoming && isAddress(incoming) ? storeAddress(incoming) : getStoredAddress();
    setAddress(active);
    setDraft(active);
  }, []);

  useEffect(() => {
    if (!address) return;
    let alive = true;
    const run = async () => {
      const res = await fetch(`/api/balances?address=${address}`, { cache: "no-store" });
      const data = (await res.json()) as BalanceResponse;
      if (!alive) return;
      setBalances(data.balances ?? EMPTY_BALANCES);
      setDeployed(Boolean(data.deployed));
    };
    run().catch(() => undefined);
    const id = setInterval(() => run().catch(() => undefined), 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [address]);

  const status = useMemo(() => {
    if (!address) return t("connectPaste");
    if (!deployed) return t("connectPending");
    return t("connectLive");
  }, [address, deployed, t]);

  const save = () => {
    if (!isAddress(draft)) {
      setNote(t("validAddress"));
      return;
    }
    const next = storeAddress(draft);
    setAddress(next);
    setNote(t("addressConnected"));
  };

  return (
    <section className="panel sticky top-3 z-30 mx-auto mt-3 flex max-w-7xl flex-col gap-3 rounded-2xl px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-lime" />
          <span className="text-xs font-bold uppercase tracking-widest text-paper/55">{status}</span>
        </div>
        <div className="truncate font-mono text-sm font-bold">{address ? shortAddress(address) : t("noWallet")}</div>
      </div>

      <div className="min-w-0 flex-1 lg:px-5">
        <BalanceChips balances={balances} limit={4} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t("addressPlaceholder")}
          className="focus-ring min-w-0 rounded-xl border border-white/10 bg-black/25 px-3 py-2 font-mono text-xs text-paper outline-none sm:w-72"
        />
        <button onClick={save} className="focus-ring rounded-xl bg-paper px-4 py-2 text-sm font-black text-ink">
          {t("connect")}
        </button>
        <Link href="/wallet" className="rounded-xl border border-white/15 px-4 py-2 text-center text-sm font-bold text-paper/80">
          {t("navWallet")}
        </Link>
      </div>

      {note && (
        <button onClick={() => setNote("")} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-paper px-4 py-2 text-sm font-bold text-ink shadow-xl">
          {note}
        </button>
      )}
    </section>
  );
}
