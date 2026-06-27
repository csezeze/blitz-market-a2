export function shortAddress(address?: string): string {
  if (!address) return "No wallet";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function compact(value: number | bigint): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}m`;
}

export function money(value: number | bigint): string {
  return compact(value);
}

export function explorerTx(explorerUrl: string, hash: string): string {
  return `${explorerUrl.replace(/\/$/, "")}/tx/${hash}`;
}

export function explorerAddress(explorerUrl: string, address: string): string {
  return `${explorerUrl.replace(/\/$/, "")}/address/${address}`;
}
