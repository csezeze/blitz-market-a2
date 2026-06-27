import { defineChain } from "viem";
import { blitzcoin } from "./shared";

export const MONAD_RPC_URL =
  process.env.MONAD_RPC_URL ||
  process.env.NEXT_PUBLIC_MONAD_RPC_URL ||
  blitzcoin.rpcUrl ||
  "https://testnet-rpc.monad.xyz";

export const EXPLORER_URL =
  blitzcoin.explorerUrl || "https://testnet.monadexplorer.com";

export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [MONAD_RPC_URL] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: EXPLORER_URL },
  },
  testnet: true,
});
