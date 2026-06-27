# New Session Handoff For A3 Main Integration

This file explains how to use the current A1/A2/A3 markdown files in a new Codex session when moving the work into the main project.

Main target repo:

```txt
csezeze/blitzpass-monad
```

Current planning/reference repo:

```txt
csezeze/blitz-market-a2
```

Current branch with A3 planning docs:

```txt
a3
```

## Goal For The New Session

The new session should implement A3 inside the main project.

A3 means:

- A1 provides the event/pass/reward flow.
- A2 provides the market/wallet/swap/buy/receipt flow.
- The main repo provides the Monad-aligned contracts, deploy script, shared artifacts, and sync receipt relayer.

The final product should feel like one app:

```txt
BlitzPass event -> reward coin -> market -> swap/buy -> receipt/order
```

## Files To Read First

Read these files in this order.

1. `docs/A3_BIRLESIK_SURUM_PLANI.md`

Use this as the main Turkish product and implementation plan.

2. `docs/A3_VERSION_SPEC.md`

Use this for the technical architecture and acceptance criteria.

3. `docs/MAIN_PROJECT_MERGE_AUDIT.md`

Use this to understand why the main repo should be the base and what must not be overwritten.

4. `docs/A1_A2_REQUIRED_CHANGES.md`

Use this as the detailed checklist for A1 and A2 fixes before or during the merge.

5. `docs/A2_IMPLEMENTATION_PLAN.md`

Use this as the A2 market feature reference.

6. `docs/A1_BRIEF.md` and `docs/A2_BRIEF.md`

Use these only when more background is needed.

## Suggested First Message In The New Session

Paste this into the new Codex session after opening the main repo:

```txt
We are integrating A1 and A2 into an A3 version inside the main repo `csezeze/blitzpass-monad`.

Please read these reference files from the A2 repo/branch `a3`:
- docs/A3_BIRLESIK_SURUM_PLANI.md
- docs/A3_VERSION_SPEC.md
- docs/MAIN_PROJECT_MERGE_AUDIT.md
- docs/A1_A2_REQUIRED_CHANGES.md

Main implementation rules:
- Use `csezeze/blitzpass-monad` as the base.
- Keep the lane-based BlitzPass contract.
- Keep BlitzCoin and the deploy script that writes shared artifacts.
- Keep the `eth_sendRawTransactionSync` relayer path.
- Bring A2 market UI, wallet, swap, buy, receipts, and TR/EN language toggle into the main app.
- Fix A1 reward flow so reward goes to BlitzCoin, not BlitzPass.
- Use chain reads as the primary source of truth for balances and orders.
- Do not commit any private key, wallet secret, or env file.
- Keep UI text clean and avoid decorative emoji/arrow-style labels.

Start by auditing the current main repo against the A3 docs, then implement the smallest safe integration step.
```

## Branch Plan

In the main repo, create a new branch for A3 implementation:

```txt
git switch -c a3
```

If `a3` already exists, switch to it:

```txt
git switch a3
```

Use short natural commits:

```txt
docs: add a3 integration notes
fix: route rewards through coin contract
feat: add market identity bridge
feat: read market balances from blitzcoin
feat: show checkout receipts
feat: add bilingual market copy
docs: add demo flow
```

## What To Copy Into The Main Repo

Copy or port the concepts, not every file blindly.

From A2:

- market layout and product browsing,
- wallet balance display,
- swap panel,
- buy panel,
- receipt card,
- orders from `Purchased` events,
- `?addr=0xUSER` identity bridge,
- TR/EN locale system.

From A1:

- event room to market handoff,
- reward trigger after successful claim,
- same address across claim, reward, and market.

From main:

- `BlitzPass.sol` lane model,
- `BlitzCoin.sol`,
- deploy script,
- shared artifacts,
- relayer helper structure,
- sync receipt support.

## What Not To Copy

Do not copy these into A3:

- A1's global `totalTx++` write path,
- A1's reward route that points to the BlitzPass contract,
- hardcoded `localhost:3001` market URL,
- localStorage as the primary balance or order source,
- demo-only receipt or fake purchase state,
- private keys, wallet secrets, `.env` files, or real relayer credentials.

## A3 Implementation Order

Follow this order in the main repo.

1. Confirm current main contract and relayer status.
2. Confirm `BlitzPass` uses lanes.
3. Confirm `BlitzCoin` has `reward`, `swap`, `buy`, `balancesOf`, and `Purchased`.
4. Confirm deploy writes `shared/blitzpass.json` and `shared/blitzcoin.json`.
5. Normalize shared artifact fields, especially `explorerUrl`.
6. Fix or verify `/api/reward` sends to `BlitzCoin`.
7. Port A2 address bridge into the main market route.
8. Port A2 balance reads from `balancesOf`.
9. Port A2 buy/swap receipt UI.
10. Replace local ledger as the primary source of truth.
11. Add or polish TR/EN language toggle.
12. Add README demo flow.
13. Build and run the app.
14. Check the repo for secrets before commit.

## Secret Safety Checklist

Before each commit:

```txt
git diff --cached
git status --short
```

Search for risky values:

```txt
RELAYER_KEYS
PRIVATE_KEY
SECRET
.env
0x...
```

Only placeholders are allowed in committed docs.

Never commit:

- private keys,
- real relayer keys,
- seed phrases,
- `.env.local`,
- `.env`,
- deployment secrets.

## Expected A3 Acceptance Criteria

A3 is ready when:

- one wallet address is used across pass, reward, market, wallet, and orders,
- reward is minted through `BlitzCoin.reward`,
- market balances come from `BlitzCoin.balancesOf`,
- swap and buy are real chain transactions,
- receipt UI shows Monad transaction metadata,
- orders come from `Purchased` events,
- app supports Turkish and English,
- no secret is committed,
- public repo and live deployment are demo-ready.

