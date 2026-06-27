import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { OrdersClient } from "@/components/OrdersClient";
import { OrdersIntro } from "@/components/PageIntro";

export default function OrdersPage() {
  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <OrdersIntro />
        <OrdersClient />
      </section>
    </main>
  );
}
