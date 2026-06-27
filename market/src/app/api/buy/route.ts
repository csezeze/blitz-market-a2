import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { COIN_ABI, COIN_ADDRESS, isCoinDeployed } from "@/lib/contract";
import { normalizeRelayReceipt } from "@/lib/receipt";
import { relay } from "@/lib/relayer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = Number(body?.productId);
    const address = body?.address;
    const coinId = Number(body?.coinId);
    const price = Number(body?.price);

    if (!Number.isInteger(productId) || !Number.isInteger(coinId) || !Number.isInteger(price) || !isAddress(address)) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    if (!isCoinDeployed) {
      return NextResponse.json({ error: "contract_not_deployed" }, { status: 503 });
    }

    const receipt = normalizeRelayReceipt(await relay(COIN_ADDRESS as `0x${string}`, COIN_ABI, "buy", [
      BigInt(productId),
      address,
      BigInt(coinId),
      BigInt(price),
    ]));

    return NextResponse.json({ ok: true, ...receipt });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "buy_failed" }, { status: 500 });
  }
}
