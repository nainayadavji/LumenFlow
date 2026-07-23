# 🥋 Rise In · Level 1 — White Belt Submission

**Project:** LumenLink POS — Web3 Point-of-Sale Register  
**Developer:** Naina Yadav  
**GitHub:** [nainayadavji/LumenFlow](https://github.com/nainayadavji/LumenFlow)  
**Network:** Stellar Testnet  

---

## ✅ Submission Checklist

| Requirement | Status |
| --- | --- |
| Freighter wallet set up on Testnet | ✅ Done |
| Wallet connect / disconnect implemented | ✅ Done |
| Wallet address displayed on screen | ✅ Done |
| XLM balance fetched and displayed | ✅ Done |
| Send XLM transaction on Testnet | ✅ Done |
| Transaction hash shown on success | ✅ Done |
| Public GitHub repository | ✅ Done |

---

## 📸 Screenshots

### 1 — Wallet Connected & XLM Balance Displayed

Shows the Freighter wallet connected (GAIT…FOSY), the live XLM balance (9,799.99998 XLM), and the POS Checkout form ready to accept a charge.

![Wallet Connected and Balance](./public/screenshots/wallet%20connect%20and%20balance.png)

---

### 2 — Payment Settled — Success UI

Shows a completed Testnet payment with the **Receipt Generated / Payment Settled** confirmation panel, transaction hash (4feafa29…db4bc339), and the View on Stellar Expert button.

![Transaction Success UI](./public/screenshots/transcation%20sucess%20ui.png)

---

### 3 — Live Transaction on Stellar Expert Explorer

Confirms the transaction is **Successful** on Stellar Testnet — Ledger 3757495, Source Account GAIT…FOSY, sent 100 XLM to GDDU…N2MB, Memo: Table 1 – Coffee, Fee: 0.00001 XLM.

![Transaction Explorer](./public/screenshots/transaction%20explorer.png)

---

## 📖 Project Summary

**LumenLink POS** is a premium Web3 point-of-sale checkout register for physical retail merchants. It demonstrates the core Stellar development workflow from Level 1:

- **Wallet Setup** — Freighter extension is detected, prompted for installation if missing, then connected with one click.
- **Balance Display** — Fetches the native XLM balance live from Horizon Testnet and refreshes automatically after payments.
- **Testnet Payment** — Merchant enters a customer address, charge amount (XLM), and optional receipt memo. Freighter signs the transaction and the settlement confirms in ~3 seconds.
- **Transaction Feedback** — Shows a Receipt Generated / Payment Settled panel with the transaction hash and a direct Stellar Expert explorer link.

---

## 🛠️ How to Run

`ash
git clone https://github.com/nainayadavji/LumenFlow.git
cd LumenFlow
npm install
npm run dev
`

Open http://localhost:5173 in your browser with the **Freighter** extension set to **Testnet**.

---

Built with love for the **Rise In · Stellar Journey to Mastery** program.
