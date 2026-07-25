# 🟡 Rise In · Level 2 — Yellow Belt Submission

**Project:** LumenLink POS & Soroban Live Poll  
**Developer:** Naina Yadav  
**GitHub:** [nainayadavji/LumenFlow](https://github.com/nainayadavji/LumenFlow)  
**Branch:** `level-2-yellow-belt`  
**Network:** Stellar Testnet  

---

## ✅ Submission Checklist

| Requirement | Status | Verification / Details |
| --- | --- | --- |
| **Public GitHub Repository** | ✅ Done | `nainayadavji/LumenFlow` |
| **README with setup instructions** | ✅ Done | Included in `README.md` & `LEVEL2.md` |
| **Minimum 2+ meaningful commits** | ✅ Done | Multiple structured commits on `level-2-yellow-belt` |
| **Multi-Wallet Integration (StellarWalletsKit)** | ✅ Done | Multi-wallet modal supporting Freighter, LOBSTR, xBull, Albedo, Hana |
| **Screenshot: Wallet options available** | ✅ Done | `public/screenshots/wallet-options.svg` |
| **Contract Deployed on Testnet** | ✅ Done | `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF` |
| **Contract Called from Frontend** | ✅ Done | Reads question & tallies, checks `has_voted`, executes `vote()` |
| **Transaction Hash of Contract Call** | ✅ Done | [`962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270`](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270) |
| **3 Error Types Handled** | ✅ Done | 1. Wallet Not Found/Connected<br/>2. User Rejected Signing<br/>3. Already Voted (`Error::AlreadyVoted #2`) |
| **Real-time Event Integration & Status Tracking** | ✅ Done | RPC `getEvents` streaming `VoteCast` events & full state machine |

---

## 🔑 Deployed Smart Contract Details

| Field | Value |
| --- | --- |
| **Contract ID** | `CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF` |
| **Wasm Hash** | `efa13f5c3a20a90f57c6473f2695d3d1d7c62aa4a78b008c3b0978c112bf3286` |
| **Deployer Address** | `GDI4GQSJKBRCWYWYQQG5DFSOLZJTRBW7A65N26M3NL7E3DOL5SND4OUN` |
| **Network** | Stellar **Testnet** |
| **Soroban RPC URL** | `https://soroban-testnet.stellar.org` |
| **Stellar Expert Explorer** | [View Contract on Explorer ↗](https://stellar.expert/explorer/testnet/contract/CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF) |

---

## ⚡ Verifiable Contract Call Transaction

| Item | Details |
| --- | --- |
| **Function Invoked** | `vote(voter: Address, choice: bool)` |
| **Choice** | `true` (YES) |
| **Transaction Hash** | `962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270` |
| **Stellar Expert Link** | [View Vote Tx on Explorer ↗](https://stellar.expert/explorer/testnet/tx/962277ffe98c620f83bfbd5c165466a0dc1105a97b165c287145166b6f4e2270) |

---

## 📸 Screenshots

### 1 — Wallet Options Available (StellarWalletsKit Multi-Wallet Modal)
Shows the multi-wallet picker modal with options for **Freighter**, **LOBSTR**, **xBull**, **Albedo**, and **Hana Wallet**.

![Wallet Options Available](./public/screenshots/wallet-options.svg)

---

### 2 — Payment Settled & Balance Display
Shows live native XLM cash register balance with real-time balance refresh on Stellar Testnet.

![Wallet Connected and Balance](./public/screenshots/wallet%20connect%20and%20balance.png)

---

### 3 — Successful Transaction UI
Shows successful payment settlement feedback with copyable transaction hash and direct Stellar Expert link.

![Transaction Success UI](./public/screenshots/transcation%20sucess%20ui.png)

---

### 4 — Explorer Verification
Shows transaction verified on Stellar Expert explorer.

![Transaction Explorer](./public/screenshots/transaction%20explorer.png)

---

## ⚠️ 3 Handled Error Types

The dApp explicitly detects and handles 3 distinct error scenarios with clear user-facing UI cards:

1. **Wallet Not Found / Not Connected Error**
   - **Trigger:** Attempting to vote without connecting a wallet.
   - **UI Feedback:** Displays `Wallet Not Found / Connected: Please connect your Stellar wallet first.` with a direct "Connect Wallet" CTA button.

2. **User Rejected / Cancelled Signing Error**
   - **Trigger:** Rejecting or closing the transaction signing prompt in the wallet extension.
   - **UI Feedback:** Catches signature error and displays `User Rejected: Transaction signing was rejected by user.`

3. **Already Voted Contract Error (`Error::AlreadyVoted #2`)**
   - **Trigger:** Attempting a second vote from an address that has already voted.
   - **UI Feedback:** Catches Soroban contract panic/error discriminant `#2` and displays `AlreadyVoted: You have already cast a vote in this poll.`

---

## 📊 Transaction Status Tracking & Event Synchronization

### Status Machine Lifecycle
Every smart contract call cycles through a visual status badge (`TxStatusBadge`):
1. **Building** — `[1/3] Building Soroban Contract Invocation Transaction...`
2. **Signing** — `[2/3] Awaiting Wallet Signature... Please approve in your wallet extension.`
3. **Submitting** — `[3/3] Submitting to Soroban Testnet RPC & Polling Ledger...`
4. **Success** — `✓ Vote Recorded On-Chain Successfully!` (with transaction hash & explorer link)

### Real-time Event Integration
- Subscribes to Soroban RPC `getEvents` for topic `VoteCast`.
- Streams live contract events every 6 seconds and updates poll tallies (`yes` / `no`) automatically without requiring page reloads.

---

## 🛠️ How to Run Locally

```bash
git clone https://github.com/nainayadavji/LumenFlow.git
cd LumenFlow
git checkout level-2-yellow-belt
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Switch tabs between **🛒 Merchant POS** and **🔮 Live Poll**.

---

<div align="center">
  Built with 💙 for the <strong>Rise In · Stellar Journey to Mastery</strong> Level 2 (Yellow Belt).
</div>
