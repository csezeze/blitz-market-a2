import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { COIN_ABI, COIN_ADDRESS, isCoinDeployed } from "@/lib/contract";
import { normalizeRelayReceipt } from "@/lib/receipt";
import { relay } from "@/lib/relayer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const address = body?.address;
    const fromId = Number(body?.fromId);
    const toId = Number(body?.toId);
    const amount = Number(body?.amount);

    if (!isAddress(address) || !Number.isInteger(fromId) || !Number.isInteger(toId) || !Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    if (!isCoinDeployed) {
      return NextResponse.json({ error: "contract_not_deployed" }, { status: 503 });
    }

    const receipt = normalizeRelayReceipt(await relay(COIN_ADDRESS as `0x${string}`, COIN_ABI, "swap", [
      address,
      BigInt(fromId),
      BigInt(toId),
      BigInt(amount),
    ]));

    return NextResponse.json({ ok: true, ...receipt });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "swap_failed" }, { status: 500 });
  }
}
