import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { EMPTY_BALANCES, readBalances } from "@/lib/balances";
import { isCoinDeployed } from "@/lib/contract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";

  if (!isAddress(address)) {
    return NextResponse.json({ error: "bad_address", deployed: isCoinDeployed, balances: EMPTY_BALANCES }, { status: 400 });
  }

  try {
    const balances = await readBalances(address as `0x${string}`);
    return NextResponse.json({ deployed: isCoinDeployed, balances }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "balances_failed", deployed: isCoinDeployed, balances: EMPTY_BALANCES },
      { status: 500 }
    );
  }
}
