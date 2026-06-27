import { createPublicClient, http, type Abi } from "viem";
import { monadTestnet, MONAD_RPC_URL } from "./chain";
import { blitzcoin } from "./shared";

export const COIN_ADDRESS = (blitzcoin.address || "") as `0x${string}` | "";
export const COIN_ABI = blitzcoin.abi as Abi;
export const COIN_CHAIN_ID = blitzcoin.chainId;
export const isCoinDeployed = Boolean(COIN_ADDRESS);

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(MONAD_RPC_URL),
});
