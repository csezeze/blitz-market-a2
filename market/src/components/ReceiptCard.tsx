"use client";

import Link from "next/link";
import { coinById } from "@/lib/coins";
import { EXPLORER_URL } from "@/lib/chain";
import { explorerTx, shortAddress } from "@/lib/format";
import { useLocale } from "@/lib/i18n";
import { productById } from "@/lib/products";

export type Receipt = {
  productId: number;
  user: string;
  coinId: number;
  price: number;
  hash: string;
  demo?: boolean;
};

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const { t } = useLocale();
  const product = productById(receipt.productId);
  const coin = coinById(receipt.coinId);

  return (
    <div className="pop-in rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-lime">{t("receipt")}</div>
          <h3 className="mt-1 text-lg font-black">{product?.name ?? `Product #${receipt.productId}`}</h3>
          <p className="mt-1 font-mono text-xs text-paper/55">{shortAddress(receipt.user)}</p>
        </div>
        <div className="text-right font-mono text-sm font-black tabular">
          <div>{receipt.price}</div>
          <div style={{ color: coin.accent }}>{coin.code}</div>
        </div>
      </div>
      {receipt.demo ? (
        <div className="mt-3 rounded-xl bg-sun/15 px-3 py-2 text-xs font-bold text-sun">
          {t("demoPreview")}
        </div>
      ) : (
        <Link
          href={explorerTx(EXPLORER_URL, receipt.hash)}
          target="_blank"
          className="mt-3 block truncate rounded-xl bg-black/25 px-3 py-2 font-mono text-xs text-sky"
        >
          {receipt.hash}
        </Link>
      )}
    </div>
  );
}
