import Link from "next/link";

export function Header() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/" className="font-display text-3xl uppercase">
        Blitz<span className="text-gradient">Market</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm font-bold text-paper/70">
        <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/wallet">
          Wallet
        </Link>
        <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/orders">
          Orders
        </Link>
        <Link className="hidden rounded-full px-3 py-2 hover:bg-white/10 sm:inline-block" href="/dashboard">
          Dashboard
        </Link>
      </nav>
    </header>
  );
}
