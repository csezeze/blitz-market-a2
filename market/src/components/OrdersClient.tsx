"use client";

import { useEffect, useState } from "react";
import { getStoredAddress } from "@/lib/identity";
import type { Purchase } from "@/lib/orders";
import { ReceiptCard } from "./ReceiptCard";

type OrdersResponse = {
  deployed: boolean;
  orders: Purchase[];
};

export function OrdersClient() {
  const [address, setAddress] = useState<`0x${string}` | "">("");
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    const active = getStoredAddress();
    setAddress(active);
    if (!active) return;
    const run = async () => {
      const res = await fetch(`/api/orders?address=${active}`, { cache: "no-store" });
      const data = (await res.json()) as OrdersResponse;
      setOrders(data.orders ?? []);
      setDeployed(Boolean(data.deployed));
    };
    run().catch(() => undefined);
  }, []);

  if (!address) {
    return <div className="panel rounded-2xl p-6 text-paper/65">Connect a BlitzPass address to load receipts.</div>;
  }

  if (!deployed) {
    return <div className="panel rounded-2xl p-6 text-paper/65">BlitzCoin address is pending. Receipts appear after A1 deploys the shared contract.</div>;
  }

  if (orders.length === 0) {
    return <div className="panel rounded-2xl p-6 text-paper/65">No on-chain purchases for this address yet.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {orders.map((order) => (
        <ReceiptCard
          key={order.id}
          receipt={{
            productId: order.productId,
            user: order.user,
            coinId: order.coinId,
            price: order.price,
            hash: order.hash,
          }}
        />
      ))}
    </div>
  );
}
