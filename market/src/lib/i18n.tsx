"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "tr";

const STORAGE_KEY = "blitzmarket.locale.v1";

const COPY = {
  en: {
    navWallet: "Wallet",
    navOrders: "Orders",
    navDashboard: "Dashboard",
    localeLabel: "Language",
    heroEyebrow: "Live Monad event economy",
    heroTitleA: "Spend the",
    heroTitleB: "moment.",
    heroText: "Event coins from BlitzPass turn into tickets, gear, apparel, and instant receipts.",
    openWallet: "Open wallet",
    shopTickets: "Shop tickets",
    categories: "Categories",
    category: "Category",
    backTo: "Back to {category}",
    coin: "Coin",
    dropNote: "Drop note",
    tapToBuy: "Buy",
    stockLeft: "left",
    connectPaste: "paste BlitzPass address",
    connectPending: "contract pending",
    connectLive: "live balances",
    noWallet: "No active wallet",
    addressPlaceholder: "0x address from BlitzPass",
    connect: "Connect",
    validAddress: "Enter a valid 0x address.",
    addressConnected: "Address connected.",
    payWith: "Pay with",
    price: "price",
    onChain: "on-chain",
    pending: "pending",
    buyNow: "Buy now",
    processing: "Processing",
    connectFirst: "Connect address first",
    contractPending: "BlitzCoin address pending",
    needMore: "Need {amount} more {coin}",
    swapInto: "Swap into {coin}",
    purchased: "Purchased. Receipt landed.",
    receipt: "Receipt",
    demoPreview: "Demo preview. Add the deployed BlitzCoin address for on-chain receipts.",
    openExplorer: "Open explorer",
    activeWallet: "Active wallet",
    oneToOneSwap: "1:1 swap",
    from: "From",
    to: "To",
    amount: "Amount",
    swapUnavailable: "Swap unavailable",
    swapAction: "Swap {from} to {to}",
    swapped: "Swapped {amount} {from} into {to}.",
    walletEyebrow: "Wallet",
    walletTitle: "Swap desk",
    walletText: "Convert event coins for the drop you want, then return to the shelf and buy gaslessly.",
    ordersEyebrow: "Orders",
    ordersTitle: "Receipts",
    ordersConnect: "Connect a BlitzPass address to load receipts.",
    ordersPending: "BlitzCoin address is pending. Receipts appear after A1 deploys the shared contract.",
    ordersEmpty: "No on-chain purchases for this address yet.",
    economyEyebrow: "Economy",
    economyTitle: "Live supply",
    whyMonad: "Why Monad",
    economyHeading: "One shared event economy",
    economyText:
      "BlitzPass creates rewards, BlitzMarket spends them, and Monad keeps the shared state on-chain. The result is a consumer flow built from many small transactions: earn, swap, buy, and read receipts without handing users a gas workflow.",
    stepEarn: "Earn",
    stepEarnText: "BlitzPass grants event coins when a user checks in or completes an event action.",
    stepHold: "Hold",
    stepHoldText: "BlitzMarket reads the same shared balances from the BlitzCoin contract.",
    stepSwap: "Swap",
    stepSwapText: "Users convert event coins into the coin required by a product drop.",
    stepSpend: "Spend",
    stepSpendText: "The market burns or deducts coins and records the purchase on Monad.",
    stepReceipt: "Receipt",
    stepReceiptText: "Orders are reconstructed from contract events and linked to the explorer.",
  },
  tr: {
    navWallet: "Cüzdan",
    navOrders: "Siparişler",
    navDashboard: "Panel",
    localeLabel: "Dil",
    heroEyebrow: "Canlı Monad etkinlik ekonomisi",
    heroTitleA: "Anı",
    heroTitleB: "harca.",
    heroText: "BlitzPass etkinlik coinleri bilete, ürüne, takasa ve zincir üstü makbuza dönüşür.",
    openWallet: "Cüzdanı aç",
    shopTickets: "Biletlere bak",
    categories: "Kategoriler",
    category: "Kategori",
    backTo: "{category} kategorisine dön",
    coin: "Coin",
    dropNote: "Drop notu",
    tapToBuy: "Satın al",
    stockLeft: "kaldı",
    connectPaste: "BlitzPass adresini gir",
    connectPending: "kontrat bekleniyor",
    connectLive: "canlı bakiyeler",
    noWallet: "Aktif cüzdan yok",
    addressPlaceholder: "BlitzPass 0x adresi",
    connect: "Bağla",
    validAddress: "Geçerli bir 0x adresi gir.",
    addressConnected: "Adres bağlandı.",
    payWith: "Ödeme coini",
    price: "fiyat",
    onChain: "zincirde",
    pending: "bekliyor",
    buyNow: "Satın al",
    processing: "İşleniyor",
    connectFirst: "Önce adres bağla",
    contractPending: "BlitzCoin adresi bekleniyor",
    needMore: "{amount} {coin} daha gerekli",
    swapInto: "{coin} coinine çevir",
    purchased: "Satın alma kaydedildi. Makbuz hazır.",
    receipt: "Makbuz",
    demoPreview: "Demo önizlemesi. Zincir üstü makbuz için BlitzCoin adresi eklenmeli.",
    openExplorer: "Explorer'da aç",
    activeWallet: "Aktif cüzdan",
    oneToOneSwap: "1:1 takas",
    from: "Kaynak",
    to: "Hedef",
    amount: "Miktar",
    swapUnavailable: "Takas kullanılamıyor",
    swapAction: "{from} coinini {to} yap",
    swapped: "{amount} {from}, {to} olarak takas edildi.",
    walletEyebrow: "Cüzdan",
    walletTitle: "Takas masası",
    walletText: "İstediğin ürün için etkinlik coinlerini dönüştür, sonra markete dönüp gas ödemeden satın al.",
    ordersEyebrow: "Siparişler",
    ordersTitle: "Makbuzlar",
    ordersConnect: "Makbuzları görmek için BlitzPass adresini bağla.",
    ordersPending: "BlitzCoin adresi bekleniyor. A1 ortak kontratı deploy edince makbuzlar görünecek.",
    ordersEmpty: "Bu adres için henüz zincir üstü satın alma yok.",
    economyEyebrow: "Ekonomi",
    economyTitle: "Canlı arz",
    whyMonad: "Neden Monad",
    economyHeading: "Tek ortak etkinlik ekonomisi",
    economyText:
      "BlitzPass ödül üretir, BlitzMarket bu ödülleri harcatır, Monad ise ortak durumu zincirde tutar. Akış çok sayıda küçük işlemden oluşur: kazan, takas et, satın al ve kullanıcıya gas süreci yaşatmadan makbuz oku.",
    stepEarn: "Kazan",
    stepEarnText: "Kullanıcı check-in yaptığında veya etkinlik aksiyonu tamamladığında BlitzPass etkinlik coini verir.",
    stepHold: "Tut",
    stepHoldText: "BlitzMarket aynı ortak bakiyeleri BlitzCoin kontratından okur.",
    stepSwap: "Takas et",
    stepSwapText: "Kullanıcı etkinlik coinini ürünün istediği coine dönüştürür.",
    stepSpend: "Harca",
    stepSpendText: "Market coini yakar veya düşer ve satın almayı Monad üzerinde kaydeder.",
    stepReceipt: "Makbuz",
    stepReceiptText: "Siparişler kontrat eventlerinden yeniden oluşturulur ve explorer bağlantısı verilir.",
  },
} as const;

type CopyKey = keyof typeof COPY.en;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: CopyKey, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "tr" || saved === "en") setLocaleState(saved);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const setLocale = (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    };

    const t = (key: CopyKey, params?: Record<string, string | number>) => {
      let text: string = COPY[locale][key] || COPY.en[key];
      if (params) {
        for (const [param, value] of Object.entries(params)) {
          text = text.replaceAll(`{${param}}`, String(value));
        }
      }
      return text;
    };

    return { locale, setLocale, t };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
