# BlitzMarket A1 / A2 Split

Source brief: `C:\Users\zzeyn\Downloads\MARKET_BRIEF.md`
Reference repo: `csezeze/blitz-market-a2`

Note: the reference repo is public but currently empty, so this split is derived from the market brief and the existing BlitzPass direction.

## Goal

BlitzPass and BlitzMarket should feel like two separate live apps powered by one shared Monad testnet economy.

- A1 owns the event-side reward flow and shared on-chain foundation.
- A2 owns the market where users spend, swap, and show receipts for earned coins.

## A1 Scope

A1 is the shared foundation and PC1 event app side.

### A1 Must Have

- Shared `BlitzCoin` contract with multi-token balances.
- `reward(uint256 eventId, address user)` for event reward distribution.
- `balanceOf`, `balancesOf`, and `totalSupply` reads for both apps.
- Shared ABI/address artifact at `shared/blitzcoin.json`.
- Real Monad testnet deployment on chain `10143`.
- Explorer verification for the deployed contract address.
- BlitzPass integration:
  - user attends an event,
  - user receives random event coin reward,
  - app shows earned coin amount,
  - app creates market link with `?addr=0xUSER`.
- PC1 relayer/funding path for reward transactions.
- No file conflicts with A2.

### A1 Nice To Have

- Reward feed on the BlitzPass stage screen.
- "Go to Market" QR from the BlitzPass phone UI.
- Shared event/coin metadata exported for A2.
- Simple contract tests for reward idempotency and balance reads.

### A1 Out Of Scope For Us

We should not spend A2 time refactoring BlitzPass UI unless it blocks the market demo. A2 can work against `shared/blitzcoin.json`, a placeholder address, or a mocked deployed artifact until the final shared contract is ready.

## A2 Scope

A2 is the BlitzMarket app. This is our focus.

### A2 Must Have

- Next.js 16 App Router app under `market/`.
- Visual market homepage with:
  - hero,
  - category strips,
  - featured product grid,
  - live sold/recent activity band.
- Product catalog in `market/src/lib/products.ts`.
- Address bridge:
  - read `?addr=0xUSER`,
  - save active address in localStorage,
  - allow manual paste/change.
- Wallet page:
  - show all BlitzCoin balances with `balancesOf`,
  - support BLITZ and event-specific coins.
- Product detail page:
  - large product cover,
  - coin price,
  - stock/availability,
  - buy CTA,
  - insufficient balance path to swap.
- Swap UI:
  - coin to coin,
  - 1:1 conversion for demo simplicity,
  - relayed `swap(address user, uint256 fromId, uint256 toId, uint256 amount)`.
- Buy flow:
  - relayed `buy(uint256 productId, address user, uint256 coinId, uint256 price)`,
  - receipt state after purchase,
  - transaction hash/explorer link.
- Orders page:
  - read `Purchased` events,
  - filter by active address,
  - show receipt cards.
- Gasless relayer API:
  - own A2 `RELAYER_KEYS`,
  - no key sharing with A1,
  - nonce-safe round-robin pattern.
- Shared config:
  - read `shared/blitzcoin.json` or copy to `market/src/lib/blitzcoin.json`,
  - no hardcoded contract addresses.
- README/demo notes for A2.

### A2 Nice To Have

- Dashboard page with total supply, top products, and live economy stats.
- QR connect screen for phone-to-market identity transfer.
- Buy/swap toast animations.
- "Latest sold" marquee backed by `Purchased` events.
- Demo mode fallback if the shared contract address is still empty.
- `eth_sendRawTransactionSync` receipt path for Monad-specific instant UI.

## Shared Rules

- Do not hardcode hallucinated token or contract addresses.
- Verify deployed addresses in the Monad explorer before final demo.
- Keep functions explainable in one sentence.
- Keep commits small and meaningful.
- Do not build a generic marketplace; keep the story tied to BlitzPass rewards and Monad.
- Security is intentionally demo-light: relayer trusts the provided `user` address.

## A2 Success Criteria

A2 is demo-ready when we can show this flow:

1. User arrives from BlitzPass with `?addr=0xUSER`.
2. Market recognizes the address and displays balances.
3. User opens a product.
4. If needed, user swaps one coin into the required coin.
5. User buys the product gaslessly.
6. UI shows receipt and explorer link.
7. Orders page lists the purchase from on-chain `Purchased` events.

## Demo Pitch

BlitzPass creates demand by rewarding live event participation. BlitzMarket closes the loop by letting users spend those rewards instantly in a shared on-chain event economy. PC1 distributes coins, PC2 burns and swaps them, and Monad keeps the whole experience fast enough to feel like a normal consumer app.
