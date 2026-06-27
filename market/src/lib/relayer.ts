import "server-only";
import { createWalletClient, http, type Abi, type Hex, type WalletClient } from "viem";
import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { MONAD_RPC_URL, monadTestnet } from "./chain";
import { publicClient } from "./contract";

type Signer = {
  account: PrivateKeyAccount;
  client: WalletClient;
  nonce: number | null;
  tail: Promise<unknown>;
};

let signers: Signer[] | null = null;
let cursor = 0;

function normalizeKey(key: string): Hex {
  const trimmed = key.trim();
  return (trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`) as Hex;
}

function getSigners(): Signer[] {
  if (signers) return signers;
  const raw = (process.env.RELAYER_KEYS || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);

  signers = raw.map((key) => {
    const account = privateKeyToAccount(normalizeKey(key));
    const client = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http(MONAD_RPC_URL),
    });
    return { account, client, nonce: null, tail: Promise.resolve() };
  });

  return signers;
}

export function relayerReady(contractAddress: string): boolean {
  return Boolean(contractAddress) && getSigners().length > 0;
}

async function sendVia(
  signer: Signer,
  contractAddress: `0x${string}`,
  abi: Abi,
  functionName: string,
  args: readonly unknown[]
): Promise<Hex> {
  if (signer.nonce === null) {
    signer.nonce = await publicClient.getTransactionCount({
      address: signer.account.address,
      blockTag: "pending",
    });
  }

  const nonce = signer.nonce;
  signer.nonce = nonce + 1;

  try {
    return await signer.client.writeContract({
      account: signer.account,
      chain: monadTestnet,
      address: contractAddress,
      abi,
      functionName,
      args,
      nonce,
      gas: BigInt(180000),
    });
  } catch (error) {
    signer.nonce = null;
    throw error;
  }
}

export async function relay(
  contractAddress: `0x${string}`,
  abi: Abi,
  functionName: string,
  args: readonly unknown[]
): Promise<Hex> {
  if (!relayerReady(contractAddress)) {
    throw new Error("relayer_not_ready");
  }

  const pool = getSigners();
  const signer = pool[cursor % pool.length];
  cursor += 1;

  const run = signer.tail.then(
    () => sendVia(signer, contractAddress, abi, functionName, args),
    () => sendVia(signer, contractAddress, abi, functionName, args)
  );
  signer.tail = run.catch(() => undefined);
  return run;
}
