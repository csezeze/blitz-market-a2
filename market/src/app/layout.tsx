import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlitzMarket - Monad Event Market",
  description: "Spend and swap BlitzPass rewards in a live Monad testnet market.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
