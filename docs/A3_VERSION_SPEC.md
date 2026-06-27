# BlitzMarket A3 Version Spec

Target: A1 and A2 work should converge into one integrated A3 version for the main project.

Main project: `csezeze/blitzpass-monad`

Reference repos:

- A1: `emir07emir/blitz-market-a1`
- A2: `csezeze/blitz-market-a2`

## A3 Product Idea

A3 should be a live event reward market.

Users join an event in BlitzPass, earn event-specific BlitzCoin, then spend or swap those coins in BlitzMarket without needing testnet gas in their own wallet. The same wallet address must move through the whole product:

```txt
Join event -> Claim pass -> Earn event coin -> Open market -> Swap if needed -> Buy reward -> See receipt/order
```

This keeps the app easy to explain in a Turkish presentation:

- A1 proves live event participation and reward creation.
- A2 proves the reward has a real spending loop.
- Monad is the reason this can feel instant under many small transactions.

## A3 Architecture

Use the main repo as the base.

Keep from main:

- lane-based `BlitzPass` contract,
- `BlitzCoin` contract,
- deploy script that writes shared artifacts,
- `eth_sendRawTransactionSync` relayer path,
- `/api/reward`, `/api/buy`, `/api/swap` split by contract.

Bring from A1:

- event room flow,
- claim/pass UX,
- reward trigger after successful claim,
- market handoff with the same user address.

Bring from A2:

- polished market UI,
- TR/EN language toggle,
- `?addr=0xUSER` address bridge,
- on-chain `balancesOf` reads,
- swap/buy panels,
- receipt card with status, block, gas, and explorer link,
- orders from `Purchased` events.

Do not bring into A3:

- A1 global `totalTx++` hot write path,
- A1 reward route that sends `reward` to the BlitzPass address,
- localStorage as the primary balance/order source,
- hardcoded market URL,
- demo-only copy that makes the chain look optional.

## Monad Fit

A3 should make Monad visible through behavior, not only text.

### Parallel execution story

`BlitzPass` should keep the lane model:

```txt
laneOf(eventId, user) -> laneCount[lane]
```

This avoids every claim/reaction writing to the same counter slot. Many users can claim or react during a live event without turning one shared storage key into the main bottleneck.

### Instant receipt story

The relayer should try:

```txt
eth_sendRawTransactionSync
```

For market buys and swaps, the UI should show the returned receipt fields when available:

- transaction hash,
- status,
- block number,
- gas used,
- sync or fallback mode.

This is a strong hackathon point because the product can feel like a normal checkout while still being on-chain.

### Shared economy story

The coin earned in the event must be the same coin spent in the market.

The source of truth should be:

```solidity
BlitzCoin.balancesOf(user, coinIds)
BlitzCoin.swap(fromCoinId, toCoinId, amount)
BlitzCoin.buy(productId, coinId, price)
Purchased(productId, user, coinId, price, timestamp)
```

## A3 Repo Shape

Recommended final shape inside `csezeze/blitzpass-monad`:

```txt
contracts/
  contracts/
    BlitzPass.sol
    BlitzCoin.sol
  scripts/
    deploy.js

shared/
  blitzpass.json
  blitzcoin.json

web/
  src/
    app/
      page.tsx
      market/
      wallet/
      tickets/
      verify/
      api/
        reward/
        buy/
        swap/
    components/
      MarketView.tsx
      WalletView.tsx
      ReceiptCard.tsx
      LocaleToggle.tsx
    lib/
      blitzpass.json
      blitzcoin.json
      relayer.ts
      coin.ts
      locale.ts
```

A2 can remain a standalone reference repo, but the final demo should feel like one product in the main repo.

## A3 User Flow

1. User opens BlitzPass.
2. App creates or receives the active wallet address.
3. User claims an event pass.
4. API calls `BlitzPass.claimPass`.
5. API calls `BlitzCoin.reward`.
6. UI shows the earned amount and event coin.
7. User opens `/market?addr=0xUSER`.
8. Market reads `BlitzCoin.balancesOf`.
9. User swaps coins if a product needs another coin type.
10. User buys the product through `/api/buy`.
11. Receipt shows Monad transaction details.
12. Orders page reconstructs purchases from `Purchased` events.

## A3 Implementation Tasks

### A3-1. Normalize shared contract artifacts

Use one artifact shape:

```json
{
  "address": "0x...",
  "chainId": 10143,
  "rpcUrl": "https://testnet-rpc.monad.xyz",
  "explorerUrl": "https://testnet.monadexplorer.com",
  "coinIds": {},
  "abi": []
}
```

If older code still reads `explorer`, keep both fields for compatibility.

### A3-2. Fix reward ownership

Reward calls must go to `BlitzCoin`, not `BlitzPass`.

The relayer should expose separate helpers:

```ts
relayClaim(...)
relayReward(...)
relayBuy(...)
relaySwap(...)
```

This avoids ABI/address confusion and makes the product easier to explain.

### A3-3. Replace local ledger as primary truth

Market and wallet should read from chain first.

LocalStorage can stay only for:

- active address,
- temporary optimistic receipt cache,
- UI preferences such as selected language.

Balances and orders should come from `BlitzCoin`.

### A3-4. Integrate A2 market UI into main routes

Move A2's stronger market pieces into main:

- market home,
- catalog/product cards,
- wallet balance chips,
- buy panel,
- swap panel,
- receipt card,
- TR/EN toggle.

Keep the final text clean and presentation-ready. Avoid decorative symbols in core UI labels.

### A3-5. Make language a product feature

Default can stay English for judges, but Turkish should be one click away for the live presentation.

Translate:

- event claim status,
- earned coin message,
- market labels,
- wallet labels,
- receipt fields,
- order history,
- dashboard Monad explanation.

### A3-6. Add a demo script

The README should include a short demo path:

```txt
1. Deploy contracts.
2. Open BlitzPass.
3. Join event and claim pass.
4. Confirm reward receipt.
5. Open market with same address.
6. Swap coins.
7. Buy product.
8. Open receipt/order page.
9. Show explorer link and sync receipt metadata.
```

## A3 Acceptance Criteria

A3 is ready when:

- one deploy writes real BlitzPass and BlitzCoin addresses,
- one wallet address is used across pass, reward, market, wallet, and orders,
- reward is minted by `BlitzCoin.reward`,
- market balances are read from `BlitzCoin.balancesOf`,
- swap and buy are on-chain calls,
- buy receipts show Monad transaction metadata,
- orders come from `Purchased` events,
- the app works in both English and Turkish,
- no private key or real wallet secret is committed,
- public repo and live deployment can be shown without manual patching.

## Suggested Natural Commit Plan

Use concise implementation commits:

```txt
docs: define a3 integration scope
fix: route rewards through coin contract
feat: add shared market identity bridge
feat: read market balances from blitzcoin
feat: show transaction receipts in checkout
feat: add bilingual market copy
docs: add demo flow
```

