# A2 Brief - BlitzMarket

This file is for our A2 work.

## Mission

A2 owns BlitzMarket: the market where users spend and swap coins earned in BlitzPass.

Core idea:

```txt
BlitzPass creates rewards. BlitzMarket turns those rewards into products, tickets, swaps, and receipts.
```

The market should feel like a live, visual consumer app, not a generic Web3 dashboard.

## Must Build

### App Shell

Create a standalone Next.js app under:

```txt
market/
```

Stack:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- viem
- qrcode.react

Scripts should use webpack on Windows:

```json
{
  "dev": "next dev --webpack",
  "build": "next build --webpack"
}
```

### Visual Direction

Style:

- festival/poster energy,
- modern e-commerce grid,
- Trendyol/Zara-like density,
- warm gradients,
- bold product covers,
- no generic neon-web3 look.

Use tokens from the brief:

```css
--color-ink: #0e0b16;
--color-paper: #f7f3ea;
--color-flame: #ff5a3c;
--color-sun: #ffc93c;
--color-punch: #ff2e97;
--color-grape: #7c3aed;
--color-lime: #c6ff4a;
--color-sky: #2dd4ff;
```

Useful helpers:

- `.grain`
- `.panel`
- `.marquee`
- `.pop-in`
- `.text-gradient`

### Routes

Required routes:

```txt
/                 market home
/c/[category]     category list
/product/[id]     product detail
/wallet           balances + swap
/orders           purchase receipts
```

Optional:

```txt
/dashboard        live economy stats
```

### Product Catalog

Create:

```txt
market/src/lib/products.ts
```

Include products like:

- Manifest front-stage ticket
- VALORANT final VIP
- AfterDark 3-day combo
- Monad Dev Laptop
- Wireless headphones
- Monad hoodie
- Festival tee
- Blitz sneaker

Each product should have:

```ts
id
name
category
price
coinId
emoji
gradient
description
stock
```

### Address Bridge

A2 must accept identity from A1.

Behavior:

- read `?addr=0xUSER` from URL,
- validate with viem `isAddress`,
- save active address in localStorage,
- allow manual paste/change,
- show active user in `ConnectBar`.

This is required for the cross-app demo.

### Shared Contract Config

Read shared BlitzCoin config from:

```txt
shared/blitzcoin.json
```

or copy it into:

```txt
market/src/lib/blitzcoin.json
```

Never hardcode a guessed contract address. If the address is empty, show demo placeholder state clearly.

Monad constants:

```txt
Chain ID: 10143
RPC: https://testnet-rpc.monad.xyz
Explorer: https://testnet.monadexplorer.com
```

### Chain Reads

Use viem public client to read:

```solidity
balancesOf(address user, uint256[] ids)
balanceOf(uint256 coinId, address user)
totalSupply(uint256 coinId)
```

Show balances in:

- home connect bar,
- wallet page,
- product detail buy panel.

### Swap Flow

Build a simple 1:1 coin swap UI.

Call through relayer:

```solidity
swap(address user, uint256 fromId, uint256 toId, uint256 amount)
```

UI states:

- input amount,
- select from/to coin,
- insufficient balance,
- pending,
- success with tx/explorer link,
- failure.

### Buy Flow

Call through relayer:

```solidity
buy(uint256 productId, address user, uint256 coinId, uint256 price)
```

UI states:

- enough balance -> buy,
- not enough balance -> suggest swap,
- pending,
- success receipt,
- explorer link.

Receipt should show:

- product name,
- user address,
- coin spent,
- price,
- tx hash,
- timestamp if available.

### Orders

Read `Purchased` events and filter by active address.

Show:

- receipt cards,
- product info,
- price,
- coin,
- explorer link.

### Relayer

A2 must use its own relayer key pool.

Environment:

```txt
RELAYER_KEYS=0x...,0x...,0x...
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

Rules:

- Do not share A1 keys.
- Relayer trusts the provided `user` address. This is intentional for hackathon demo.
- Keep per-signer nonce sequencing stable.
- Prefer a generic relay helper:

```ts
relay(contractAddress, abi, functionName, args)
```

API routes:

```txt
POST /api/swap
POST /api/buy
```

Optional Monad polish:

- implement `eth_sendRawTransactionSync` for full receipt UX.

## A2 Success Criteria

A2 is demo-ready when:

1. User opens `/?addr=0xUSER`.
2. Market recognizes the same BlitzPass identity.
3. Wallet page shows all coin balances.
4. User can open a product page.
5. User can swap coins if needed.
6. User can buy a product gaslessly.
7. Receipt appears with tx/explorer link.
8. `/orders` shows the purchase from on-chain events.

## Demo Script For A2

1. Receive user from A1 with `?addr=0xUSER`.
2. Show balances: BLITZ and event coins.
3. Open Manifest ticket.
4. If balance is short, swap BLITZ into Manifest coin.
5. Buy the ticket.
6. Show receipt and explorer link.
7. Open orders page.
8. Close with: one shared Monad economy, two live apps.

## Things To Avoid

- Do not modify A1/BlitzPass files unless absolutely required.
- Do not hardcode fake addresses.
- Do not build a generic marketplace disconnected from BlitzPass rewards.
- Do not overbuild security or auth.
- Do not use a plain form-heavy UI; it should feel visual and alive.

## Commit Plan

1. `docs: add a2 market brief`
2. `feat: scaffold blitzmarket app`
3. `feat: add product catalog and visual home`
4. `feat: add address bridge and wallet balances`
5. `feat: add swap flow`
6. `feat: add buy and receipt flow`
7. `feat: add orders from purchased events`
8. `docs: add demo and deployment notes`
