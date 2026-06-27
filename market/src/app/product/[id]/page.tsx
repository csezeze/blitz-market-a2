import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel } from "@/components/BuyPanel";
import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { PriceTag } from "@/components/PriceTag";
import { coinById } from "@/lib/coins";
import { productById } from "@/lib/products";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = productById(Number(id));
  if (!product) notFound();
  const coin = coinById(product.coinId);

  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <Link href={`/c/${product.category.toLowerCase()}`} className="text-sm font-bold text-paper/55 hover:text-paper">
              Back to {product.category}
            </Link>
            <PriceTag price={product.price} coinId={product.coinId} />
          </div>
          <div className="grain cover-grid flex aspect-[16/10] min-h-[360px] flex-col justify-between rounded-3xl p-6" style={{ background: product.gradient }}>
            <div className="relative z-10 flex items-start justify-between">
              <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                {product.category}
              </span>
              <span className="rounded-full bg-lime px-3 py-1 text-xs font-black uppercase tracking-widest text-ink">
                {product.stock} left
              </span>
            </div>
            <div className="relative z-10">
              <div className="font-display text-9xl uppercase text-white">{product.mark}</div>
              <h1 className="mt-3 max-w-3xl text-4xl font-black text-white sm:text-5xl">{product.name}</h1>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="panel rounded-2xl p-5">
              <div className="text-xs font-black uppercase tracking-widest text-paper/45">Coin</div>
              <div className="mt-2 text-2xl font-black" style={{ color: coin.accent }}>
                {coin.name}
              </div>
            </div>
            <div className="panel rounded-2xl p-5 md:col-span-2">
              <div className="text-xs font-black uppercase tracking-widest text-paper/45">Drop note</div>
              <p className="mt-2 text-paper/72">{product.description}</p>
            </div>
          </div>
        </div>
        <BuyPanel product={product} />
      </section>
    </main>
  );
}
