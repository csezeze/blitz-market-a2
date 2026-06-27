# Main Project Merge Audit

Target main repo: `csezeze/blitzpass-monad`

Reviewed repos:

- A1: `emir07emir/blitz-market-a1`
- A2: `csezeze/blitz-market-a2`
- Main: `csezeze/blitzpass-monad`

## Short Verdict

Direct merge is not ready yet.

The main repo is currently the best base because it already has:

- lane-based `BlitzPass` storage for Monad parallel execution,
- `BlitzCoin` contract,
- `eth_sendRawTransactionSync` relayer path,
- `/market`, `/wallet`, `/tickets`, `/verify` routes,
- deploy script that writes `shared/blitzcoin.json`.

A1 and A2 should not be merged into main as-is. A1 has contract/deploy issues. A2 has a cleaner standalone market UI and bilingual support, but it expects a slightly different shared artifact shape.

## Monad Architecture Fit

### Good In Main

The main repo's `BlitzPass` is the most Monad-aware implementation:

- `LANES = 64`
- `laneOf(eventId, user)`
- `laneCount[lane]`
- `totalTx()` sums lane counts off the hot path

This is aligned with Monad optimistic parallel execution because high-frequency claim/react transactions avoid one shared global counter on the write path.

Main also has a relayer path that attempts `eth_sendRawTransactionSync`, then falls back to async submit and receipt wait. This is the right direction for the "instant receipt UX" story.

### Weak In Main

The main repo market/wallet UI still relies heavily on `web/src/lib/ledger.ts`, which is localStorage state.

That means:

- UI balances can diverge from `BlitzCoin`,
- buy/swap can look successful locally even if the on-chain tx fails,
- orders/tickets are local-first instead of event-first,
- the chain is not yet the single source of truth for the market.

For final integration, market balances, purchases, swaps, and receipts should read from `BlitzCoin`, not localStorage.

## A1 Status

A1 has a `BlitzCoin.sol`, but it is not integrated correctly.

Critical issues:

1. `contracts/scripts/deploy.js` deploys only `BlitzPass`.
2. A1 has no `shared/blitzcoin.json` in the repo.
3. A1 `web/src/lib/contract.ts` imports only `blitzpass.json`.
4. A1 `/api/reward` calls `relay("reward", ...)`.
5. A1 `web/src/lib/relayer.ts` sends all calls to `CONTRACT_ADDRESS`, which is the `BlitzPass` address.
6. `BlitzPass` ABI does not include `reward`, so A1 reward transactions will fail.
7. A1 `BlitzPass.sol` still uses global `totalTx++`, which is less aligned with Monad parallel execution than the main repo's lane design.

Conclusion: A1 should either be updated from the main repo's contracts/relayer structure or treated only as a prototype reference.

## A2 Status

A2 is cleaner as a standalone market:

- reads balances through `balancesOf`,
- uses relayed `buy` and `swap`,
- reads `Purchased` events for orders,
- accepts `?addr=0xUSER`,
- has TR/EN toggle,
- has a dashboard that explains the shared Monad economy.

Main mismatch:

- A2 expects `shared/blitzcoin.json.explorerUrl`.
- Main uses `shared/blitzcoin.json.explorer`.
- A2's `shared/blitzcoin.json` still has an empty address.

Conclusion: A2 is a good source for the final market UX, but before merging it into main, align shared config field names and decide whether A2 should become a separate `market/` app or replace main's current `/market` and `/wallet` implementation.

## Recommended Merge Strategy

Use main repo as the base.

Do not overwrite the main repo with A1.

Merge in these A2 parts selectively:

- bilingual locale system,
- cleaner market pages,
- address bridge from `?addr=`,
- on-chain balance read pattern,
- on-chain orders from `Purchased` events,
- dashboard explanation of the economy.

Keep these main repo parts:

- lane-based `BlitzPass`,
- `BlitzCoin` contract from main,
- deploy script that deploys both contracts,
- `eth_sendRawTransactionSync` relayer,
- `/api/reward`, `/api/buy`, `/api/swap` structure.

Replace or refactor:

- `web/src/lib/ledger.ts` should stop being the source of truth.
- Market and wallet should read `BlitzCoin` balances directly.
- Orders and tickets should be based on `Purchased` events, with optional local UI cache only after successful receipt.

## Integration Acceptance Criteria

The final main repo is integrated when:

1. Deploy writes a real `shared/blitzcoin.json.address`.
2. A1 reward flow calls `BlitzCoin.reward`, not `BlitzPass.reward`.
3. BlitzPass claim produces a market link with the same user address.
4. Market receives `?addr=0xUSER`.
5. Market reads `balancesOf(user, ids)` from the same `BlitzCoin`.
6. Swap calls `BlitzCoin.swap`.
7. Buy calls `BlitzCoin.buy`.
8. Orders read `Purchased` events for that user.
9. UI shows Monad receipt status from the relayer response.
10. Market/wallet do not depend on localStorage as the primary balance source.

## Final Architecture

```txt
BlitzPass UI
  uses burner address
  calls /api/claim
  calls /api/reward

Relayer
  sends claim/react to BlitzPass
  sends reward/buy/swap to BlitzCoin
  uses eth_sendRawTransactionSync where possible

BlitzCoin
  reward creates event coins
  balancesOf is used by wallet and market
  swap converts coins
  buy records purchase events

BlitzMarket
  receives ?addr
  reads balances from BlitzCoin
  submits buy/swap through relayer
  reads Purchased events for orders and tickets
```

