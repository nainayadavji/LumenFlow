# 🛒 LumenLink POS & Soroban Live Poll — Level 2 (Yellow Belt)

> **Rise In · Stellar Journey to Mastery — Level 2 (Yellow Belt) Submission**

A clean, premium **Web3 Point-of-Sale Register & Soroban Governance Poll dApp**.
Features **StellarWalletsKit multi-wallet connection**, real-time **Horizon XLM payment settlements**, and an **on-chain Soroban smart contract poll** with real-time event streaming via RPC on **Stellar Testnet**. Built with **React + Vite + TypeScript + Tailwind CSS**, **Soroban SDK (Rust)**, and `@stellar/stellar-sdk`.

- **Deployed Contract ID:** `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF`
- **Sample Vote Tx Hash:** [`962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270`](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270)
- **Level 2 Summary & Checklist:** See [`LEVEL2.md`](./LEVEL2.md)

![Stellar](https://img.shields.io/badge/Stellar-Testnet-3b82f6)
![React](https://img.shields.io/badge/React-18-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Project Description

**LumenLink POS** is a modern, merchant-friendly Point-of-Sale checkout register designed to settle retail payments using the core building blocks of the Stellar ecosystem:

- Connecting a browser wallet (**Freighter**)
- Reading account data from **Horizon** (Testnet)
- Building, signing, and submitting a **payment transaction**

It is intentionally scoped to the **Testnet only**, so you can learn and experiment safely without spending real funds. The app never touches your private keys — all signing happens inside the Freighter extension.

---

## ✨ Features

### 🔐 Wallet
- **Detect** whether Freighter is installed (with an install prompt if not)
- **Connect** the Freighter wallet
- **Disconnect** the wallet
- **Display** the connected public address (truncated, with copy)
- **Network guard** — warns if Freighter isn't set to Testnet
- **Session restore** — reconnects silently on reload if already authorized

### 💰 Balance
- Fetch the native **XLM balance** from the Stellar Testnet
- Beautiful gradient balance display
- **Loading** skeleton state
- Friendly **error handling** (unfunded account → one-click Friendbot funding)
- **Refresh** button + automatic refresh after a successful payment

### 💸 Transaction
- Input a **receiver address** (validated client-side)
- Input an **amount** (validated)
- Optional **text memo**
- **Send XLM** on Testnet (signed by Freighter)
- **Success / failure** feedback via toasts
- Displays the **transaction hash**
- Direct **Stellar Expert explorer** link

### 🎨 UI / UX
- Modern **dark theme** with layered glow background
- Fully **responsive** (mobile → desktop)
- Frosted-glass **cards**
- **Animated** buttons with tactile press states
- **Toast** notifications (success / error / info)
- **Loading indicators** and shimmering skeletons

### 🎁 Bonus
- 📋 Copy wallet address button
- 📋 Copy transaction hash button
- 🔭 Explorer buttons (account & transaction)
- 🔄 Refresh balance button
- 🚀 One-click Friendbot funding for new accounts

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | React 18 + Vite 5                       |
| Language   | TypeScript 5 (strict)                   |
| Styling    | Tailwind CSS 3                          |
| Blockchain | `@stellar/stellar-sdk` (Horizon)        |
| Wallet     | `@stellar/freighter-api`                |
| Network    | Stellar **Testnet**                     |

---

## 🗂️ Project Structure

```
lumen-flow/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── balance/BalanceCard.tsx
│   │   ├── layout/         (Header, Hero, Footer)
│   │   ├── transaction/SendTransaction.tsx
│   │   ├── ui/             (Button, Card, Input, Toast, Spinner, CopyButton)
│   │   └── wallet/WalletConnect.tsx
│   ├── config/stellar.ts   # network config from env vars
│   ├── context/            (WalletContext, ToastContext)
│   ├── hooks/              (useBalance, useCopy)
│   ├── services/           (freighter.ts, stellar.ts)
│   ├── types/index.ts
│   ├── utils/              (format, clipboard, events)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** ≥ 18
- **npm** (or pnpm / yarn)
- **[Freighter](https://www.freighter.app/)** browser extension, set to **Testnet**

### Clone & install

```bash
git clone https://github.com/nainayadavji/LumenFlow.git
cd LumenFlow
npm install
```

---

## ⚙️ Environment Variables

Copy the example file (the defaults already target Testnet, so this is optional):

```bash
cp .env.example .env
```

| Variable                  | Description                          | Default                                     |
| ------------------------- | ------------------------------------ | ------------------------------------------- |
| `VITE_HORIZON_URL`        | Horizon API endpoint (Testnet)       | `https://horizon-testnet.stellar.org`       |
| `VITE_NETWORK_PASSPHRASE` | Stellar network passphrase (Testnet) | `Test SDF Network ; September 2015`         |
| `VITE_EXPLORER_URL`       | Stellar Expert explorer base URL     | `https://stellar.expert/explorer/testnet`   |
| `VITE_FRIENDBOT_URL`      | Friendbot funding endpoint (Testnet) | `https://friendbot.stellar.org`             |

> ℹ️ Only variables prefixed with `VITE_` are exposed to the browser by Vite. The app ships with safe Testnet fallbacks, so it also runs with no `.env` file.

---

## 🖥️ Run Locally

```bash
# Start the dev server (http://localhost:5173)
npm run dev

# Type-check + production build
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

---

## 🧭 How to Use

1. Set **Freighter** to the **Testnet** network.
2. Click **Connect Wallet** and approve the connection.
3. If your account is new, click **🚀 Fund with Friendbot** to receive test XLM.
4. Your **XLM balance** appears — use **Refresh** anytime.
5. In **Send XLM**, enter a receiver address + amount, then **Send Payment**.
6. Approve the transaction in Freighter.
7. On success, **copy the transaction hash** or open it on **Stellar Expert**.

---

## 📸 Screenshots

**Multi-Wallet Options Available (StellarWalletsKit)**
![Wallet Options Available](./public/screenshots/wallet-options.svg)

**Wallet Connected & XLM Balance**
![Wallet Connected and Balance](./public/screenshots/wallet%20connect%20and%20balance.png)

**Payment Settled — Success UI**
![Transaction Success UI](./public/screenshots/transcation%20sucess%20ui.png)

**Live Transaction on Stellar Expert Explorer**
![Transaction Explorer](./public/screenshots/transaction%20explorer.png)

---

## 🔒 Security Notes

- This dApp **never** handles or stores private keys — all signing happens inside **Freighter**.
- It operates exclusively on the **Testnet**. Do not repurpose for Mainnet without a thorough review.
- Your real `.env` is **git-ignored** and never committed.

---

## 📄 License

Released under the [MIT License](./LICENSE).

---

<div align="center">
  Built with 💙 for the <strong>Rise In · Stellar Journey to Mastery</strong> program.
</div>
