import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { COINS } from "@/lib/coins";
import { isCoinDeployed, publicClient, COIN_ADDRESS, COIN_ABI } from "@/lib/contract";

const ECONOMY_STEPS = [
  {
    label: "Earn",
    call: "reward(eventId, user)",
    text: "BlitzPass grants event coins when a user checks in or completes an event action.",
  },
  {
    label: "Hold",
    call: "balancesOf(user, ids)",
    text: "BlitzMarket reads the same shared balances from the BlitzCoin contract.",
  },
  {
    label: "Swap",
    call: "swap(user, fromId, toId, amount)",
    text: "Users convert event coins into the coin required by a product drop.",
  },
  {
    label: "Spend",
    call: "buy(productId, user, coinId, price)",
    text: "The market burns or deducts coins and records the purchase on Monad.",
  },
  {
    label: "Receipt",
    call: "Purchased event",
    text: "Orders are reconstructed from contract events and linked to the explorer.",
  },
];

async function readSupplies() {
  if (!isCoinDeployed) return COINS.map((coin) => ({ coin, supply: 0 }));
  const supplies = await Promise.all(
    COINS.map(async (coin) => {
      const supply = (await publicClient.readContract({
        address: COIN_ADDRESS as `0x${string}`,
        abi: COIN_ABI,
        functionName: "totalSupply",
        args: [BigInt(coin.id)],
      })) as bigint;
      return { coin, supply: Number(supply) };
    })
  );
  return supplies;
}

export default async function DashboardPage() {
  const supplies = await readSupplies();

  return (
    <main>
      <ConnectBar />
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="text-xs font-black uppercase tracking-widest text-paper/45">Economy</div>
          <h1 className="font-display text-6xl uppercase text-gradient">Live supply</h1>
        </div>

        <section className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel rounded-2xl p-6">
            <div className="text-xs font-black uppercase tracking-widest text-paper/45">Why Monad</div>
            <h2 className="mt-3 text-3xl font-black">One shared event economy</h2>
            <p className="mt-3 text-paper/68">
              BlitzPass creates rewards, BlitzMarket spends them, and Monad keeps the shared state on-chain. The result is a consumer flow built from many small transactions: earn, swap, buy, and read receipts without handing users a gas workflow.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {ECONOMY_STEPS.map((step, index) => (
              <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="font-mono text-xs font-bold text-paper/35">{String(index + 1).padStart(2, "0")}</div>
                <div className="mt-3 text-xl font-black">{step.label}</div>
                <div className="mt-2 break-words font-mono text-[11px] text-sky">{step.call}</div>
                <p className="mt-3 text-sm text-paper/60">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supplies.map(({ coin, supply }) => (
            <div key={coin.id} className="panel rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-paper/45">{coin.name}</div>
                  <div className="mt-2 text-2xl font-black" style={{ color: coin.accent }}>
                    {coin.code}
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full" style={{ background: coin.accent }} />
              </div>
              <div className="mt-8 font-display text-5xl tabular">{supply}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
