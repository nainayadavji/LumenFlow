# 🛒 LumenLink POS & Soroban Live Poll

> **Rise In · Stellar Journey to Mastery — Full Submission (Level 1 White Belt & Level 2 Yellow Belt)**

A clean, premium **Web3 Point-of-Sale Register & Soroban Governance Poll dApp** built on the **Stellar Testnet**.
Features **StellarWalletsKit multi-wallet connection**, real-time **Horizon XLM payment settlements**, and an **on-chain Soroban smart contract poll** with real-time event streaming via Soroban RPC. Built with **React 18 + Vite 5 + TypeScript + Tailwind CSS**, **Soroban SDK (Rust)**, and `@stellar/stellar-sdk`.

- 🔗 **GitHub Repository:** [github.com/nainayadavji/LumenFlow](https://github.com/nainayadavji/LumenFlow)
- 🔮 **Deployed Soroban Contract ID:** `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF`
- ⚡ **Sample Vote Tx Hash:** [`962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270`](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270)
- 🥋 **Level 1 Readme:** [`LEVEL1.md`](./LEVEL1.md) | 🟡 **Level 2 Readme:** [`LEVEL2.md`](./LEVEL2.md)

![Stellar](https://img.shields.io/badge/Stellar-Testnet-3b82f6)
![Soroban](https://img.shields.io/badge/Soroban-Smart_Contract-purple)
![React](https://img.shields.io/badge/React-18-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🏆 Level-by-Level Submission Summaries

### 🥋 Level 1 — White Belt (Completed)

Focus: Wallet setup, XLM balances, and Testnet transaction settlements.

| Requirement | Status | Verification |
| --- | --- | --- |
| Set up Freighter wallet on Testnet | ✅ Done | Auto-detected & network check |
| Wallet connect / disconnect | ✅ Done | `WalletConnect` component & session restore |
| Display connected public key | ✅ Done | Truncated address + copy button |
| Fetch & display XLM balance | ✅ Done | Native balance via Horizon API |
| Send XLM payment transaction | ✅ Done | Signed by Freighter, settled in ~3s |
| Display transaction hash | ✅ Done | Copyable hash + Stellar Expert link |
| Detailed Level 1 Summary | ✅ Done | See [`LEVEL1.md`](./LEVEL1.md) |

---

### 🟡 Level 2 — Yellow Belt (Completed)

Focus: Multi-wallet integration, Soroban smart contract deployment, transaction status tracking, real-time events, and error handling.

| Requirement | Status | Verification |
| --- | --- | --- |
| Multi-wallet integration | ✅ Done | `StellarWalletsKit` (Freighter, LOBSTR, xBull, Albedo, Hana) |
| Screenshot of wallet options | ✅ Done | `public/screenshots/wallet-options.png` |
| Smart contract deployed on Testnet | ✅ Done | Contract ID: `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF` |
| Contract called from frontend | ✅ Done | Reads question/tallies, checks `has_voted`, executes `vote()` |
| Transaction hash of contract call | ✅ Done | [`962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270`](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270) |
| 3 Error types handled | ✅ Done | 1. Wallet Not Found<br/>2. User Rejected Signing<br/>3. Already Voted (`#2`) |
| Real-time events & status tracking | ✅ Done | RPC `getEvents` polling + status machine |
| Detailed Level 2 Summary | ✅ Done | See [`LEVEL2.md`](./LEVEL2.md) |

---

## 🔮 Smart Contract Deployment Details (Live Poll)

| Item | Details |
| ---- | ----- |
| **Network** | Stellar **Testnet** |
| **Network Passphrase** | `Test SDF Network ; September 2015` |
| **Soroban RPC** | `https://soroban-testnet.stellar.org` |
| **Contract ID** | `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF` |
| **Wasm Hash** | `efa13f5c3a20a90f57c6473f2695d3d1d7c62aa4a78b008c3b0978c112bf3286` |
| **Deployer Account** | `GDI4GQSJKBRCWYWYQQG5DFSOLZJTRBW7A65N26M3NL7E3DOL5SND4OUN` |
| **Poll Question** | *"Is Soroban the future of smart contracts on Stellar?"* |

### Explorer Links
- 📜 **Contract:** [View on Stellar Expert Explorer ↗](https://stellar.expert/explorer/testnet/contract/CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF)
- 🚀 **Deploy Tx:** [View Deployment Tx ↗](https://stellar.expert/explorer/testnet/tx/8313f43dc7c773cecb0050794f330fe5467243e9e956d554c891a70cc25cf140)
- 🗳️ **Vote Call Tx:** [View Vote Tx ↗](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270)

---

## 📸 Screenshots

### 🥋 Level 1 — White Belt Screenshots

#### 1 — Wallet Connected & XLM Balance Displayed
![Wallet Connected and Balance](./public/screenshots/wallet%20connect%20and%20balance.png)

#### 2 — Payment Settled — Success UI
![Transaction Success UI](./public/screenshots/transcation%20sucess%20ui.png)

#### 3 — Live Transaction on Stellar Expert Explorer
![Transaction Explorer](./public/screenshots/transaction%20explorer.png)

---

### 🟡 Level 2 — Yellow Belt Screenshots

#### 4 — Multi-Wallet Options Modal (StellarWalletsKit)
![Multi-Wallet Options](./public/screenshots/wallet-options.png)

#### 5 — Soroban Live Poll Smart Contract UI
![Live Poll Smart Contract](./public/screenshots/live-poll-contract.png)

#### 6 — Real-Time Soroban Event Stream
![Live Events Stream](./public/screenshots/live-events-stream.png)

---

## 🛠️ How to Run Locally

### 1. Clone & Install
```bash
git clone https://github.com/nainayadavji/LumenFlow.git
cd LumenFlow
npm install
```

### 2. Environment Setup (Optional)
Defaults point to Testnet automatically, but you can copy `.env.example`:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Switch tabs between **🛒 Merchant POS** and **🔮 Live Poll**.

---

## 📄 License

Released under the [MIT License](./LICENSE).

---

<div align="center">
  Built with 💙 by <strong>Naina Yadav</strong> for the <strong>Rise In · Stellar Journey to Mastery</strong> program.
</div>
