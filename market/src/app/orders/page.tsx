import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { OrdersClient } from "@/components/OrdersClient";

export default function OrdersPage() {
  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">Orders</div>
          <h1 className="font-display text-6xl uppercase text-gradient">Receipts</h1>
        </div>
        <OrdersClient />
      </section>
    </main>
  );
}
