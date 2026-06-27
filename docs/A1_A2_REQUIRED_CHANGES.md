# Required Changes For A1 And A2

This document lists the changes needed before merging A1 and A2 into the main project.

Main project: `csezeze/blitzpass-monad`

## A1 Required Changes

Repo: `emir07emir/blitz-market-a1`

### A1-1. Deploy BlitzCoin

Current issue:

`contracts/scripts/deploy.js` only deploys `BlitzPass`.

Required change:

- Deploy both `BlitzPass` and `BlitzCoin`.
- Write:
  - `web/src/lib/blitzpass.json`
  - `web/src/lib/blitzcoin.json`
  - `shared/blitzpass.json`
  - `shared/blitzcoin.json`

Preferred source:

Use the main repo deploy script as the reference because it already deploys both contracts and writes shared artifacts.

### A1-2. Split Pass And Coin Contract Config

Current issue:

`web/src/lib/contract.ts` imports only `blitzpass.json`.

Required change:

Add coin config:

```ts
import coin from "./blitzcoin.json";

export const COIN_ADDRESS = (coin.address || "") as `0x${string}` | "";
export const COIN_ABI = coin.abi as Abi;
export const isCoinDeployed = Boolean(COIN_ADDRESS);
```

Keep `CONTRACT_ADDRESS` only for `BlitzPass`.

### A1-3. Fix Reward Relayer

Current issue:

`/api/reward` calls:

```ts
relay("reward", [eventId, address])
```

but `relay()` sends the transaction to the `BlitzPass` address. `BlitzPass` does not have `reward`.

Required change:

Add a separate coin relay:

```ts
relayReward(eventId, user)
```

It must send:

```txt
to: COIN_ADDRESS
abi: COIN_ABI
functionName: reward
args: [eventId, user]
```

### A1-4. Use Main BlitzPass Contract

Current issue:

A1 `BlitzPass.sol` still increments one global `totalTx` slot. This is weaker for Monad.

Required change:

Use the main repo `BlitzPass.sol` with:

- `LANES = 64`
- `laneOf(eventId, user)`
- `laneCount[lane]`
- `totalTx()` as a view that sums lanes
- `lanes()` for the dashboard or stage screen

This is more aligned with Monad optimistic parallel execution.

### A1-5. Market Link Must Be Configurable

Current issue:

A1 `JoinRoom.tsx` hardcodes:

```txt
http://localhost:3001/?addr=
```

Required change:

Use env:

```txt
NEXT_PUBLIC_MARKET_URL
```

Build the link as:

```ts
`${process.env.NEXT_PUBLIC_MARKET_URL}?addr=${address}`
```

For final integrated main project, the link can be:

```txt
/market?addr=0xUSER
```

or:

```txt
https://<deployed-market-url>/?addr=0xUSER
```

### A1-6. Return Reward Amount

Current issue:

Reward UI only shows "You earned coins", not the actual amount.

Required change:

`/api/reward` should return:

```json
{
  "ok": true,
  "hash": "0x...",
  "status": "success",
  "earned": 320
}
```

Then the UI should show the actual amount and coin name.

### A1-7. Avoid Demo-Only Local State As Truth

A1 can keep optimistic UI, but final demo should make clear:

- `Rewarded` event is on-chain,
- balance is read from `BlitzCoin`,
- fallback/demo state is not the primary source of truth.

## A2 Required Changes

Repo: `csezeze/blitz-market-a2`

### A2-1. Accept Main Shared Artifact Shape

Current issue:

A2 uses:

```ts
blitzcoin.explorerUrl
```

Main repo shared artifact uses:

```json
"explorer": "https://testnet.monadexplorer.com"
```

Required change:

Support both:

```ts
export const EXPLORER_URL =
  blitzcoin.explorerUrl ||
  blitzcoin.explorer ||
  "https://testnet.monadexplorer.com";
```

This avoids breakage when A2 consumes main's `shared/blitzcoin.json`.

### A2-2. Consume Main Shared Contract Artifact

Current issue:

A2 `shared/blitzcoin.json.address` is empty.

Required change:

After main deploy:

- copy main `shared/blitzcoin.json` into A2, or
- when merged into main, import the main shared artifact directly.

A2 should not use a guessed or stale address.

### A2-3. Align API Response Shape With Main Relayer

A2 `/api/buy` and `/api/swap` return only:

```json
{ "ok": true, "hash": "0x..." }
```

Main relayer can return:

```json
{
  "ok": true,
  "hash": "0x...",
  "status": "success",
  "gasUsed": "12345",
  "blockNumber": 123,
  "sync": true
}
```

Required change:

Update A2 receipt UI to accept and display optional:

- `status`
- `gasUsed`
- `blockNumber`
- `sync`

This supports the Monad instant receipt story.

### A2-4. Use The Same User Identity As BlitzPass

A2 already supports `?addr=0xUSER`.

Required check:

When merged into main, ensure BlitzPass sends the user to:

```txt
/market?addr=0xUSER
```

and A2 market reads that address before falling back to localStorage.

### A2-5. Decide Integration Mode

There are two possible merge modes.

Recommended mode:

Replace main's current market/wallet local ledger with A2's on-chain balance model.

Alternative mode:

Add A2 as a separate app under:

```txt
market/
```

This is easier but less polished as one product.

For the hackathon final, recommended mode is to integrate A2 into main `web/` routes:

- `/market`
- `/wallet`
- `/orders`
- `/dashboard`

### A2-6. Keep TR/EN Toggle

A2's language switcher is useful for the Turkish presentation.

When merged into main:

- keep default English,
- allow TR toggle in header,
- translate dashboard and market flow,
- avoid overusing icons or decorative symbols.

## Main Repo Required Changes

Repo: `csezeze/blitzpass-monad`

### Main-1. Remove Local Ledger As Primary Source

Current issue:

`web/src/lib/ledger.ts` is localStorage-first.

Required change:

Market and wallet should read from:

```solidity
balancesOf(address user, uint256[] ids)
```

Orders should read:

```solidity
Purchased(productId, user, coinId, price, timestamp)
```

LocalStorage can remain only as a temporary display cache after successful receipts.

### Main-2. Keep Lane-Based BlitzPass

Do not replace main `BlitzPass.sol` with A1's older global-counter version.

Keep:

- `LANES`
- `laneOf`
- `laneCount`
- `lanes()`
- `totalTx()` view aggregation

### Main-3. Keep eth_sendRawTransactionSync

Do not downgrade the main relayer to A1 or A2's simpler async hash flow.

Keep the sync receipt path:

```txt
eth_sendRawTransactionSync
```

Fallback to normal async submit is fine.

### Main-4. Normalize Shared Artifact

Use one shared artifact shape:

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

If keeping `explorer`, also include `explorerUrl` for A2 compatibility.

### Main-5. Final Demo Flow

Final integrated flow should be:

1. User joins BlitzPass.
2. User receives coin from `BlitzCoin.reward`.
3. UI shows earned amount.
4. User opens market with the same address.
5. Market reads `BlitzCoin.balancesOf`.
6. User swaps if needed.
7. User buys a product.
8. Receipt displays transaction status and explorer link.
9. Orders are reconstructed from `Purchased` events.

