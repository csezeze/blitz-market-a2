import { ConnectBar } from "@/components/ConnectBar";
import { Header } from "@/components/Header";
import { COINS } from "@/lib/coins";
import { isCoinDeployed, publicClient, COIN_ADDRESS, COIN_ABI } from "@/lib/contract";

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
