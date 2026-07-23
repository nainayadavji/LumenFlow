/**
 * Wallet connect / disconnect control shown in the header.
 * Handles the three states: not installed, disconnected, connected.
 */
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { truncateAddress } from '@/utils/format';

export function WalletConnect() {
  const { address, isConnected, isInstalled, isConnecting, connect, disconnect } =
    useWallet();

  // Freighter not detected — point the user to the install page.
  if (!isInstalled) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="secondary" size="sm">
          Install Freighter ↗
        </Button>
      </a>
    );
  }

  // Connected — show the truncated address, a copy button and disconnect.
  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-sm text-slate-200">
            {truncateAddress(address)}
          </span>
          <CopyButton value={address} label="Address" className="h-6 w-6" />
        </div>
        <Button variant="ghost" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  // Disconnected — primary connect action.
  return (
    <Button size="sm" onClick={connect} isLoading={isConnecting}>
      {isConnecting ? 'Connecting…' : 'Connect Wallet'}
    </Button>
  );
}
