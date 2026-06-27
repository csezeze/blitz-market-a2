import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { WalletIntro } from "@/components/PageIntro";
import { SwapPanel } from "@/components/SwapPanel";

export default function WalletPage() {
  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <WalletIntro />
        <SwapPanel />
      </section>
    </main>
  );
}
