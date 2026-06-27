import { coinById } from "@/lib/coins";
import { money } from "@/lib/format";

export function PriceTag({ price, coinId, compact = false }: { price: number; coinId: number; compact?: boolean }) {
  const coin = coinById(coinId);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 font-mono text-sm font-bold tabular text-paper">
      <span style={{ color: coin.accent }}>{compact ? money(price) : price}</span>
      <span className="text-paper/65">{coin.code}</span>
    </span>
  );
}
