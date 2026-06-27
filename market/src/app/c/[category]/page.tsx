import { notFound } from "next/navigation";
import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, productsByCategory } from "@/lib/products";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const products = productsByCategory(category);
  const label = CATEGORIES.find((item) => item.toLowerCase() === category.toLowerCase());
  if (!label || products.length === 0) notFound();

  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">Category</div>
          <h1 className="font-display text-6xl uppercase text-gradient">{label}</h1>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
