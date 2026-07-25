# 🥋 Rise In · Level 1 — White Belt Submission

**Project:** LumenLink POS — Web3 Point-of-Sale Register  
**Developer:** Naina Yadav  
**GitHub:** [nainayadavji/LumenFlow](https://github.com/nainayadavji/LumenFlow)  
**Network:** Stellar Testnet  

---

## ✅ Submission Checklist

| Requirement | Status | Verification / Code Evidence |
| --- | --- | --- |
| **Detect Stellar Wallet Integration** | ✅ Done | `import { isConnected, isAllowed, requestAccess, getAddress, signTransaction } from '@stellar/freighter-api'` in `src/services/freighter.ts` |
| **Verify Connect Wallet Functionality** | ✅ Done | `WalletConnect` component in `src/components/wallet/WalletConnect.tsx` calling `connectWallet()` |
| **Wallet Permissions & Address Retrieval** | ✅ Done | `requestAccess()` and `getAddress()` implemented in `src/services/freighter.ts` |
| **Transaction Signing** | ✅ Done | `signTransaction(xdr, { networkPassphrase })` implemented in `src/services/freighter.ts` & `src/context/WalletContext.tsx` |
| **XLM Balance Display** | ✅ Done | Native XLM balance fetched from Horizon Testnet API |
| **Send XLM Payment Transaction** | ✅ Done | Payment transaction built, signed via Freighter, and submitted |
| **Transaction Hash & Explorer Link** | ✅ Done | Copyable hash + direct Stellar Expert explorer link |

---

## 🔐 Stellar Wallet Integration Code & Evidence

The dApp connects to the Stellar network using the official `@stellar/freighter-api` package. Below are the verified code implementations from the repository:

### 1. Wallet Detection & Connection (`src/services/freighter.ts`)
```typescript
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetworkDetails,
  signTransaction,
  WatchWalletChanges,
} from '@stellar/freighter-api';

/** Detect if Freighter browser extension is installed */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return Boolean(result?.isConnected);
  } catch {
    return false;
  }
}

/** Connect wallet: request user permissions and retrieve public key */
export async function connectWallet(): Promise<string> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error('Freighter is not installed. Please install the extension.');
  }

  const access = await requestAccess();
  if (access.error) throw new Error(access.error);
  if (!access.address) throw new Error('Freighter did not return an address.');
  
  return access.address;
}
```

---

### 2. Address Retrieval & Permissions Check (`src/services/freighter.ts`)
```typescript
/** Retrieve currently authorized address without prompting user */
export async function getConnectedAddress(): Promise<string> {
  try {
    const allowed = await isAllowed();
    if (!allowed?.isAllowed) return '';
    const address = await getAddress();
    return address.error ? '' : address.address;
  } catch {
    return '';
  }
}
```

---

### 3. Transaction Signing (`src/services/freighter.ts`)
```typescript
/** Sign base64 XDR transaction using Freighter extension */
export async function signWithFreighter(
  xdr: string,
  address: string
): Promise<string> {
  const result = await signTransaction(xdr, {
    address,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  });

  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}
```

---

### 4. Connect Wallet Component (`src/components/wallet/WalletConnect.tsx`)
```tsx
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';

export function WalletConnect() {
  const { address, isConnected, isInstalled, isConnecting, connect, disconnect } = useWallet();

  if (!isInstalled) {
    return (
      <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">
        <Button variant="secondary" size="sm">Install Freighter ↗</Button>
      </a>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span>{address.slice(0, 4)}...{address.slice(-4)}</span>
        <CopyButton value={address} />
        <Button variant="ghost" size="sm" onClick={disconnect}>Disconnect</Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={connect} isLoading={isConnecting}>
      {isConnecting ? 'Connecting…' : 'Connect Wallet'}
    </Button>
  );
}
```

---

## 📸 Screenshots

### 1 — Wallet Connected & XLM Balance Displayed
Shows the Freighter wallet connected (`GAIT…FOSY`), the live XLM balance (`9,799.99998 XLM`), and the POS Checkout form ready to accept a charge.

![Wallet Connected and Balance](./public/screenshots/wallet%20connect%20and%20balance.png)

---

### 2 — Payment Settled — Success UI
Shows a completed Testnet payment with the **Receipt Generated / Payment Settled** confirmation panel, transaction hash (`4feafa29…db4bc339`), and the View on Stellar Expert button.

![Transaction Success UI](./public/screenshots/transcation%20sucess%20ui.png)

---

### 3 — Live Transaction on Stellar Expert Explorer
Confirms the transaction is **Successful** on Stellar Testnet — Ledger 3757495, Source Account `GAIT…FOSY`, sent 100 XLM to `GDDU…N2MB`, Memo: Table 1 – Coffee, Fee: 0.00001 XLM.

![Transaction Explorer](./public/screenshots/transaction%20explorer.png)

---

## 📖 Project Summary

**LumenLink POS** is a premium Web3 point-of-sale checkout register for physical retail merchants:

- **Wallet Setup** — Freighter extension detected, prompted for installation if missing, connected with one click.
- **Balance Display** — Fetches native XLM balance live from Horizon Testnet and refreshes automatically.
- **Testnet Payment** — Merchant enters customer address, charge amount (XLM), and memo. Freighter signs the transaction and settlement confirms in ~3 seconds.
- **Transaction Feedback** — Shows Receipt Generated / Payment Settled panel with transaction hash and explorer link.

---

## 🛠️ How to Run

```bash
git clone https://github.com/nainayadavji/LumenFlow.git
cd LumenFlow
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser with the **Freighter** extension set to **Testnet**.

---

<div align="center">
  Built with 💙 for the <strong>Rise In · Stellar Journey to Mastery</strong> program.
</div>
