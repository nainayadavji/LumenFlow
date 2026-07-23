# 📄 Contract Deployment — Live Poll (Stellar Testnet)

This document records the on-chain deployment of the Live Poll Soroban smart
contract and shows how to reproduce it. Everything below was executed against
the **Stellar Testnet** and verified with real transactions.

---

## 🔑 Deployment Facts

| Item | Value |
| ---- | ----- |
| **Network** | Stellar **Testnet** |
| **Network passphrase** | `Test SDF Network ; September 2015` |
| **Soroban RPC** | `https://soroban-testnet.stellar.org` |
| **Contract ID** | `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF` |
| **Wasm hash** | `efa13f5c3a20a90f57c6473f2695d3d1d7c62aa4a78b008c3b0978c112bf3286` |
| **Deployer account** | `GDI4GQSJKBRCWYWYQQG5DFSOLZJTRBW7A65N26M3NL7E3DOL5SND4OUN` |
| **Poll question** | *"Is Soroban the future of smart contracts on Stellar?"* |

### Transaction hashes

| Purpose | Hash |
| ------- | ---- |
| **Wasm upload** | `c3746bf1b45058e2086017353fc27d79005ba8eb72308ce552867167260e3ae8` |
| **Deploy + `__constructor`** | `8313f43dc7c773cecb0050794f330fe5467243e9e956d554c891a70cc25cf140` |
| **Example vote** (`vote` → Yes) | `962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270` |

### Explorer links

- **Contract:** https://stellar.expert/explorer/testnet/contract/CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF
- **Deploy tx:** https://stellar.expert/explorer/testnet/tx/8313f43dc7c773cecb0050794f330fe5467243e9e956d554c891a70cc25cf140
- **Example vote tx:** https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270

---

## 🛠️ Reproduce the deployment

### Prerequisites

- [Rust](https://rustup.rs/) with the `wasm32v1-none` target:
  `rustup target add wasm32v1-none`
- [Stellar CLI](https://developers.stellar.org/docs/tools/cli/install-cli) `>= 22`
  (this contract was deployed with **stellar-cli 27.0.0**).
- A funded Testnet identity.

### 1. Create & fund a deployer identity

```bash
stellar keys generate deployer --network testnet --fund
stellar keys address deployer
```

### 2. Build the contract

From `contracts/poll-contract`:

```bash
stellar contract build
# → target/wasm32v1-none/release/poll_contract.wasm
```

> **Note (this machine only):** the environment used for development had a
> git-bash `link.exe` shadowing the MSVC linker and no Windows SDK, so host
> compilation of proc-macros used the self-contained GNU toolchain instead:
> `cargo +stable-x86_64-pc-windows-gnu build --target wasm32v1-none --release`.
> On a standard setup, plain `stellar contract build` is all you need.

### 3. (Optional) Optimize the Wasm

```bash
stellar contract optimize \
  --wasm target/wasm32v1-none/release/poll_contract.wasm
# → poll_contract.optimized.wasm (~6.4 KB, down from ~9 KB)
```

### 4. Deploy with the poll question (runs `__constructor`)

```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/poll_contract.optimized.wasm \
  --source-account deployer \
  --network testnet \
  --alias poll_contract \
  -- \
  --question "Is Soroban the future of smart contracts on Stellar?"
# → prints the Contract ID
```

### 5. Verify (read + write)

```bash
CID=CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF
DEP=$(stellar keys address deployer)

# Read-only: question + tallies
stellar contract invoke --id $CID --source-account deployer \
  --network testnet -- get_question
stellar contract invoke --id $CID --source-account deployer \
  --network testnet -- get_results        # → {"no":0,"yes":0}

# Write: cast a real vote (Yes)
stellar contract invoke --id $CID --source-account deployer \
  --network testnet --send=yes -- vote --voter $DEP --choice true
# → {"no":0,"yes":1} and emits a VoteCast event

# One-vote-per-address is enforced: a second vote fails with AlreadyVoted (#2)
stellar contract invoke --id $CID --source-account deployer \
  --network testnet --send=yes -- vote --voter $DEP --choice false
# → HostError: Error(Contract, #2)
```

---

## 🔁 Deploying a fresh poll

To run your **own** poll, repeat steps 2–4 with a different `--question` (and
optionally a fresh identity). Deployment produces a **new Contract ID** — put it
in your frontend `.env` as `VITE_POLL_CONTRACT_ID` (see [`.env.example`](../.env.example)).
