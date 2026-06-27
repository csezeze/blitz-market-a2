import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-7xl text-gradient">404</div>
      <h1 className="mt-4 text-2xl font-black">This drop is not on the shelf.</h1>
      <Link className="mt-6 rounded-full bg-paper px-5 py-3 font-bold text-ink" href="/">
        Back to market
      </Link>
    </main>
  );
}
