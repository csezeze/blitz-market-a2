import { COIN_ABI, COIN_ADDRESS, isCoinDeployed, publicClient } from "./contract";

export type Purchase = {
  id: string;
  productId: number;
  user: string;
  coinId: number;
  price: number;
  timestamp: number;
  hash: string;
};

export async function readPurchases(user?: `0x${string}`): Promise<Purchase[]> {
  if (!isCoinDeployed) return [];

  const logs = await publicClient.getContractEvents({
    address: COIN_ADDRESS as `0x${string}`,
    abi: COIN_ABI,
    eventName: "Purchased",
    args: user ? { user } : undefined,
    fromBlock: BigInt(0),
  });

  return logs
    .map((log) => {
      const args = log.args as {
        productId?: bigint;
        user?: string;
        coinId?: bigint;
        price?: bigint;
        timestamp?: bigint;
      };
      return {
        id: `${log.transactionHash}:${log.logIndex}`,
        productId: Number(args.productId ?? BigInt(0)),
        user: args.user ?? "",
        coinId: Number(args.coinId ?? BigInt(0)),
        price: Number(args.price ?? BigInt(0)),
        timestamp: Number(args.timestamp ?? BigInt(0)),
        hash: log.transactionHash ?? "",
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}
