import Link from "next/link";
import type { Product } from "@/lib/products";
import { PriceTag } from "./PriceTag";

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className={`group block overflow-hidden rounded-2xl border border-white/10 bg-ink-2 transition duration-300 hover:-translate-y-1 hover:border-white/25 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div
        className={`grain cover-grid relative flex aspect-[4/3] min-h-56 flex-col justify-between p-5 ${
          featured ? "lg:aspect-[16/9]" : ""
        }`}
        style={{ background: product.gradient }}
      >
        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
            {product.category}
          </span>
          <PriceTag price={product.price} coinId={product.coinId} compact />
        </div>
        <div className="relative z-10">
          <div className="font-display text-7xl uppercase text-white/95 drop-shadow-sm">{product.mark}</div>
          <h3 className="mt-2 max-w-sm text-xl font-black text-white">{product.name}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-sm font-semibold text-paper/75">{product.stock} left</span>
        <span className="font-display text-xl text-punch transition group-hover:translate-x-1">BUY</span>
      </div>
    </Link>
  );
}
