"use client";

import { useEffect, useState } from "react";
import { getStoredAddress } from "@/lib/identity";
import { useLocale } from "@/lib/i18n";
import type { Purchase } from "@/lib/orders";
import { ReceiptCard } from "./ReceiptCard";

type OrdersResponse = {
  deployed: boolean;
  orders: Purchase[];
};

export function OrdersClient() {
  const { t } = useLocale();
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
    return <div className="panel rounded-2xl p-6 text-paper/65">{t("ordersConnect")}</div>;
  }

  if (!deployed) {
    return <div className="panel rounded-2xl p-6 text-paper/65">{t("ordersPending")}</div>;
  }

  if (orders.length === 0) {
    return <div className="panel rounded-2xl p-6 text-paper/65">{t("ordersEmpty")}</div>;
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
