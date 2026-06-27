"use client";

import { useEffect, useMemo, useState } from "react";
import { coinById } from "@/lib/coins";
import { EMPTY_BALANCES, type BalanceMap } from "@/lib/balances";
import { explorerTx, shortAddress } from "@/lib/format";
import { getStoredAddress } from "@/lib/identity";
import type { Product } from "@/lib/products";
import { EXPLORER_URL } from "@/lib/chain";
import { BalanceChips } from "./BalanceChips";
import { ReceiptCard, type Receipt } from "./ReceiptCard";

type BalanceResponse = {
  deployed: boolean;
  balances: BalanceMap;
};

export function BuyPanel({ product }: { product: Product }) {
  const [address, setAddress] = useState<`0x${string}` | "">("");
  const [balances, setBalances] = useState<BalanceMap>(EMPTY_BALANCES);
  const [deployed, setDeployed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const coin = coinById(product.coinId);
  const balance = balances[product.coinId] ?? 0;
  const enough = balance >= product.price;

  useEffect(() => {
    setAddress(getStoredAddress());
  }, []);

  useEffect(() => {
    if (!address) return;
    const run = async () => {
      const res = await fetch(`/api/balances?address=${address}`, { cache: "no-store" });
      const data = (await res.json()) as BalanceResponse;
      setBalances(data.balances ?? EMPTY_BALANCES);
      setDeployed(Boolean(data.deployed));
    };
    run().catch(() => undefined);
  }, [address, receipt]);

  const disabledReason = useMemo(() => {
    if (!address) return "Connect address first";
    if (!deployed) return "BlitzCoin address pending";
    if (!enough) return `Need ${product.price - balance} more ${coin.code}`;
    return "";
  }, [address, deployed, enough, product.price, balance, coin.code]);

  const buy = async () => {
    if (disabledReason || busy || !address) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          address,
          coinId: product.coinId,
          price: product.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "buy_failed");
      setReceipt({
        productId: product.id,
        user: address,
        coinId: product.coinId,
        price: product.price,
        hash: data.hash,
      });
      setMessage("Purchased. Receipt landed.");
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">Pay with</div>
          <div className="mt-1 text-2xl font-black" style={{ color: coin.accent }}>
            {coin.code}
          </div>
        </div>
        <div className="text-right font-mono font-black tabular">
          <div className="text-4xl text-paper">{product.price}</div>
          <div className="text-xs text-paper/45">price</div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-black/25 p-4">
        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-paper/45">
          <span>{shortAddress(address)}</span>
          <span>{deployed ? "on-chain" : "pending"}</span>
        </div>
        <BalanceChips balances={balances} />
      </div>

      <button
        onClick={buy}
        disabled={Boolean(disabledReason) || busy}
        className="focus-ring mt-5 w-full rounded-2xl bg-punch px-5 py-4 text-lg font-black text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-paper/45"
      >
        {busy ? "Processing" : disabledReason || "Buy now"}
      </button>

      {!enough && address && (
        <a href="/wallet" className="mt-3 block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-bold text-paper/75">
          Swap into {coin.code}
        </a>
      )}

      {message && (
        <div className="mt-4 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-paper/70">{message}</div>
      )}

      {receipt && (
        <div className="mt-4">
          <ReceiptCard receipt={receipt} />
          <a
            href={explorerTx(EXPLORER_URL, receipt.hash)}
            target="_blank"
            className="mt-3 block rounded-xl bg-sky/10 px-3 py-2 text-center font-mono text-xs text-sky"
          >
            Open explorer
          </a>
        </div>
      )}
    </aside>
  );
}
