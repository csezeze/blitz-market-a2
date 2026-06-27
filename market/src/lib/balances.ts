import { COIN_IDS } from "./coins";
import { COIN_ABI, COIN_ADDRESS, isCoinDeployed, publicClient } from "./contract";

export type BalanceMap = Record<number, number>;

export const EMPTY_BALANCES: BalanceMap = Object.fromEntries(
  COIN_IDS.map((id) => [id, 0])
) as BalanceMap;

export async function readBalances(user: `0x${string}`): Promise<BalanceMap> {
  if (!isCoinDeployed) return EMPTY_BALANCES;

  const balances = (await publicClient.readContract({
    address: COIN_ADDRESS as `0x${string}`,
    abi: COIN_ABI,
    functionName: "balancesOf",
    args: [user, COIN_IDS.map(BigInt)],
  })) as bigint[];

  return Object.fromEntries(
    COIN_IDS.map((id, index) => [id, Number(balances[index] ?? BigInt(0))])
  ) as BalanceMap;
}
