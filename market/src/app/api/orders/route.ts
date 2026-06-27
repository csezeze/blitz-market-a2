import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { isCoinDeployed } from "@/lib/contract";
import { readPurchases } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") || "";

  if (address && !isAddress(address)) {
    return NextResponse.json({ error: "bad_address", deployed: isCoinDeployed, orders: [] }, { status: 400 });
  }

  try {
    const orders = await readPurchases(address ? (address as `0x${string}`) : undefined);
    return NextResponse.json({ deployed: isCoinDeployed, orders }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "orders_failed", deployed: isCoinDeployed, orders: [] },
      { status: 500 }
    );
  }
}
