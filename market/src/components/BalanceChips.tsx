"use client";

import { COINS } from "@/lib/coins";
import type { BalanceMap } from "@/lib/balances";
import { compact } from "@/lib/format";

export function BalanceChips({ balances, limit }: { balances: BalanceMap; limit?: number }) {
  const coins = typeof limit === "number" ? COINS.slice(0, limit) : COINS;

  return (
    <div className="flex flex-wrap gap-2">
      {coins.map((coin) => (
        <span
          key={coin.id}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-bold tabular"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: coin.accent }} />
          <span>{compact(balances[coin.id] ?? 0)}</span>
          <span className="text-paper/50">{coin.code}</span>
        </span>
      ))}
    </div>
  );
}
