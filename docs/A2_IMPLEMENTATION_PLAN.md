# A2 Implementation Plan

Project focus: BlitzMarket, the market-side app for spending BlitzPass rewards.

## Phase 0 - Repo Shape

- Create `market/` as a standalone Next.js 16 app.
- Use TypeScript, App Router, Tailwind CSS v4, React 19, viem, and qrcode.react.
- Set scripts to `next dev --webpack` and `next build --webpack`.
- Add `shared/blitzcoin.json` placeholder if the shared contract artifact is not present yet.

Acceptance:
- `market/` can install and build independently.
- No A1/BlitzPass files are modified.

## Phase 1 - Visual Market Shell

- Build homepage:
  - market hero,
  - category strip,
  - featured product grid,
  - live activity/marquee band.
- Add design tokens and helpers from the brief:
  - warm poster/e-commerce look,
  - no generic neon-web3 style,
  - `.grain`, `.panel`, `.marquee`, `.pop-in`, `.text-gradient`.
- Add `ProductCard`, `PriceTag`, `BalanceChips`, and `ConnectBar`.

Acceptance:
- The first screen already looks like a finished consumer market.
- Product cards are visually strong enough for live judging.

## Phase 2 - Catalog And Routes

- Add `src/lib/products.ts`.
- Add routes:
  - `/`
  - `/c/[category]`
  - `/product/[id]`
  - `/wallet`
  - `/orders`
  - optional `/dashboard`
- Keep categories simple:
  - Tickets
  - Tech
  - Apparel
  - Festival

Acceptance:
- Users can browse categories and open product detail pages.

## Phase 3 - Address Bridge

- Read `?addr=0xUSER` on first load.
- Validate address format with viem `isAddress`.
- Save active address to localStorage.
- Add manual paste/change UI.
- Optionally generate a local burner only when no address is provided.

Acceptance:
- A user coming from BlitzPass lands in the market with the same identity.

## Phase 4 - Chain Reads

- Add Monad testnet client:
  - chainId `10143`,
  - RPC from env or artifact,
  - explorer URL.
- Read `balancesOf(address user, uint256[] ids)`.
- Display balances on:
  - home connect bar,
  - wallet page,
  - product detail buy panel.
- If `shared/blitzcoin.json.address` is empty, show demo/placeholder state clearly.

Acceptance:
- Market can display real balances once the shared contract address is provided.

## Phase 5 - Relayer Writes

- Add server-only relayer:
  - reads `RELAYER_KEYS`,
  - round-robin key pool,
  - per-signer nonce queue,
  - generic `relay(address, abi, functionName, args)` helper.
- Add API routes:
  - `POST /api/swap`
  - `POST /api/buy`
- Return transaction hash or full receipt if we implement Monad sync RPC.

Acceptance:
- User can swap and buy without holding gas.
- Relayers are independent from A1 to avoid nonce conflicts.

## Phase 6 - Swap, Buy, Receipts

- Build `SwapPanel`.
- Build `BuySheet`.
- After buy:
  - show receipt card,
  - show product, price, coin, address, transaction link,
  - route to `/orders`.
- Read `Purchased` events for order history.

Acceptance:
- The full demo path works: balance -> swap if needed -> buy -> receipt -> orders.

## Phase 7 - Monad-Specific Polish

- Add a clear "Why Monad" section to README and possibly dashboard.
- Show:
  - gasless micro-spending,
  - shared on-chain economy,
  - high-throughput live sale feed,
  - receipt-first UX.
- Optional but valuable:
  - use `eth_sendRawTransactionSync` for buy/swap receipt UX,
  - show block number/status immediately in the UI.

Acceptance:
- Judges can see why this should be on Monad, not only in a web database.

## A2 Minimum Demo

If time is tight, cut to this:

1. Homepage and product grid.
2. `?addr=` identity bridge.
3. Wallet balances.
4. Product detail buy.
5. Swap panel.
6. Receipt/orders screen.

Dashboard and QR polish can wait.

## Commit Plan

1. `docs: split blitzmarket a1 a2 scope`
2. `feat: scaffold blitzmarket app shell`
3. `feat: add product catalog and market UI`
4. `feat: add address bridge and wallet balances`
5. `feat: add relayer buy and swap routes`
6. `feat: add orders and receipt UI`
7. `docs: add demo script and deployment notes`
