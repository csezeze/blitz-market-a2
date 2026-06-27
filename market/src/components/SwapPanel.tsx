"use client";

import { useEffect, useState } from "react";
import { COINS, coinById } from "@/lib/coins";
import { EMPTY_BALANCES, type BalanceMap } from "@/lib/balances";
import { getStoredAddress } from "@/lib/identity";
import { explorerTx, shortAddress } from "@/lib/format";
import { EXPLORER_URL } from "@/lib/chain";
import { useLocale } from "@/lib/i18n";
import { BalanceChips } from "./BalanceChips";

type BalanceResponse = {
  deployed: boolean;
  balances: BalanceMap;
};

export function SwapPanel() {
  const { t } = useLocale();
  const [address, setAddress] = useState<`0x${string}` | "">("");
  const [fromId, setFromId] = useState(0);
  const [toId, setToId] = useState(2);
  const [amount, setAmount] = useState(50);
  const [balances, setBalances] = useState<BalanceMap>(EMPTY_BALANCES);
  const [deployed, setDeployed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [hash, setHash] = useState("");

  const fromCoin = coinById(fromId);
  const toCoin = coinById(toId);
  const balance = balances[fromId] ?? 0;
  const canSwap = address && deployed && fromId !== toId && amount > 0 && balance >= amount;

  const refresh = async (active = address) => {
    if (!active) return;
    const res = await fetch(`/api/balances?address=${active}`, { cache: "no-store" });
    const data = (await res.json()) as BalanceResponse;
    setBalances(data.balances ?? EMPTY_BALANCES);
    setDeployed(Boolean(data.deployed));
  };

  useEffect(() => {
    const active = getStoredAddress();
    setAddress(active);
    refresh(active).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swap = async () => {
    if (!canSwap) return;
    setBusy(true);
    setMessage("");
    setHash("");
    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, fromId, toId, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "swap_failed");
      setHash(data.hash);
      setMessage(t("swapped", { amount, from: fromCoin.code, to: toCoin.code }));
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">{t("activeWallet")}</div>
          <div className="mt-1 font-mono text-sm font-bold">{shortAddress(address)}</div>
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-widest text-paper/50">
          {t("oneToOneSwap")}
        </div>
      </div>

      <div className="mt-5">
        <BalanceChips balances={balances} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_120px]">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-widest text-paper/45">
          {t("from")}
          <select value={fromId} onChange={(event) => setFromId(Number(event.target.value))} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-bold text-paper">
            {COINS.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.code}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-widest text-paper/45">
          {t("to")}
          <select value={toId} onChange={(event) => setToId(Number(event.target.value))} className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-bold text-paper">
            {COINS.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.code}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-widest text-paper/45">
          {t("amount")}
          <input
            value={amount}
            min={1}
            type="number"
            onChange={(event) => setAmount(Number(event.target.value))}
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 font-mono text-sm font-bold text-paper"
          />
        </label>
      </div>

      <button
        onClick={swap}
        disabled={!canSwap || busy}
        className="mt-5 w-full rounded-2xl bg-paper px-5 py-4 font-black text-ink transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-paper/45"
      >
        {busy ? t("processing") : canSwap ? t("swapAction", { from: fromCoin.code, to: toCoin.code }) : t("swapUnavailable")}
      </button>

      {message && <div className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-paper/70">{message}</div>}
      {hash && (
        <a href={explorerTx(EXPLORER_URL, hash)} target="_blank" className="mt-3 block truncate rounded-xl bg-sky/10 px-3 py-2 text-center font-mono text-xs text-sky">
          {hash}
        </a>
      )}
    </section>
  );
}
