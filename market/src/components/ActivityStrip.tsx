import { PRODUCTS } from "@/lib/products";
import { coinById } from "@/lib/coins";

export function ActivityStrip() {
  const items = PRODUCTS.slice(0, 6).map((product, index) => {
    const coin = coinById(product.coinId);
    return `${index + 1} sold - ${product.name} - ${product.price} ${coin.code}`;
  });
  const doubled = [...items, ...items];

  return (
    <div className="marquee border-y border-white/10 bg-black/25 py-3">
      <div className="marquee-track font-mono text-xs font-bold uppercase tracking-wide text-paper/70">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-lime" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
