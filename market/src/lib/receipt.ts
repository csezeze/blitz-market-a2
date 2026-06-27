export type RelayReceipt = {
  hash: string;
  status?: string;
  gasUsed?: string;
  blockNumber?: number;
  sync?: boolean;
};

export function normalizeRelayReceipt(result: unknown): RelayReceipt {
  if (typeof result === "string") return { hash: result };
  if (result && typeof result === "object" && "hash" in result) {
    const receipt = result as RelayReceipt;
    return {
      hash: receipt.hash,
      status: receipt.status,
      gasUsed: receipt.gasUsed,
      blockNumber: receipt.blockNumber,
      sync: receipt.sync,
    };
  }
  throw new Error("missing_transaction_hash");
}
