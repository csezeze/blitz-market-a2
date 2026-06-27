# A1 Brief - BlitzPass + Shared BlitzCoin

This file is for the teammate working on A1.

## Mission

A1 owns the event-side app and the shared on-chain foundation. BlitzPass should reward users with event coins, then hand the same user identity to BlitzMarket through a market link.

Core idea:

```txt
BlitzPass rewards users -> shared BlitzCoin balances update on Monad -> BlitzMarket spends/swap those balances
```

## Must Build

### Shared BlitzCoin Contract

Create or finalize the shared `BlitzCoin` contract used by both apps.

Required functions:

```solidity
reward(uint256 eventId, address user) returns (uint256)
swap(address user, uint256 fromId, uint256 toId, uint256 amount)
buy(uint256 productId, address user, uint256 coinId, uint256 price)
balanceOf(uint256 coinId, address user) view returns (uint256)
balancesOf(address user, uint256[] ids) view returns (uint256[])
totalSupply(uint256 coinId) view returns (uint256)
```

Required events:

```solidity
Rewarded(uint256 eventId, address user, uint256 amount, uint256 newBalance)
Swapped(address user, uint256 fromId, uint256 toId, uint256 amount)
Purchased(uint256 productId, address user, uint256 coinId, uint256 price, uint256 timestamp)
```

Coin model:

```txt
coinId 0 = BLITZ universal coin
coinId 1 = Monad Blitz
coinId 2 = Manifest
coinId 3 = VALORANT
coinId 4 = AfterDark
coinId 5 = Sounds of Monad
coinId 6 = Builders Meetup
```

Reward behavior:

- `reward(eventId, user)` should be callable by the relayer.
- Each user should receive the event reward once per event.
- Reward amount can be pseudo-random in the `50..500` range for demo.
- Keep it simple and explainable; this is hackathon demo code.

### Shared Artifact

Publish the ABI/address artifact here after deploy:

```txt
shared/blitzcoin.json
```

It should include:

```json
{
  "address": "0x...",
  "chainId": 10143,
  "rpcUrl": "https://testnet-rpc.monad.xyz",
  "explorerUrl": "https://testnet.monadexplorer.com",
  "abi": []
}
```

Important:

- Do not invent or hardcode fake contract addresses.
- After deployment, verify the address in the Monad explorer.
- Make sure A2 can copy/import this artifact without needing A1 source code.

### BlitzPass Integration

BlitzPass should:

- create/identify the user burner address,
- call `reward(eventId, user)` after attendance/check-in,
- show the earned amount, for example `You earned 320 BLITZ`,
- show the user's address,
- generate a "Go to Market" link:

```txt
https://<market-url>/?addr=0xUSER
```

Nice demo version:

- show this link as a QR code on the phone app or stage screen,
- include a button: `Open BlitzMarket`.

### Relayer

A1 should own reward transaction relaying.

Rules:

- Use A1's own relayer keys.
- Do not share relayer private keys with A2.
- Fund A1 relayer wallets with testnet MON.
- Keep nonce handling stable under bursts.

## Monad Testnet Constants

```txt
Chain ID: 10143
RPC: https://testnet-rpc.monad.xyz
Explorer: https://testnet.monadexplorer.com
Faucet: https://faucet.monad.xyz
```

## A1 Success Criteria

A1 is done when:

1. `BlitzCoin` is deployed on Monad testnet.
2. `shared/blitzcoin.json` contains the real deployed address and ABI.
3. BlitzPass can reward a user on-chain.
4. User can see the earned coin amount.
5. BlitzPass can send the user to BlitzMarket using `?addr=0xUSER`.
6. A2 can read balances from the same contract without asking A1 for hidden state.

## Demo Script For A1

1. User joins BlitzPass event.
2. BlitzPass creates/uses a burner address.
3. User receives event coin through `reward()`.
4. Screen shows the reward and current address.
5. User scans/open market link with `?addr=0xUSER`.
6. A2 market reads the same balances from the shared contract.

## Things To Avoid

- Do not modify A2's `market/` app.
- Do not hardcode fake addresses.
- Do not overbuild security; this is a relayer-trusted demo.
- Do not create a giant generic abstraction layer.
- Do not make reward logic impossible to explain in the pitch.

## Hand-Off To A2

Send A2:

- `shared/blitzcoin.json`
- deployed contract address
- explorer link
- supported coin IDs
- any required env names

Once A2 has that, the market can read balances, perform swaps, and buy products through the same shared economy.
