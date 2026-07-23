/**
 * BalanceCard — displays the connected account's XLM balance with loading,
 * error and empty states, plus a manual refresh button.
 */
import { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { useBalance } from '@/hooks/useBalance';
import { fundWithFriendbot } from '@/services/stellar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Skeleton } from '@/components/ui/Spinner';
import { formatXlm, truncateAddress } from '@/utils/format';
import { explorerAccountUrl } from '@/config/stellar';
import { APP_EVENTS, onAppEvent } from '@/utils/events';

const WalletIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const RefreshIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
    <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export function BalanceCard() {
  const { address } = useWallet();
  const { notify } = useToast();
  const { balance, status, error, refresh } = useBalance(address);
  const [isFunding, setIsFunding] = useState(false);

  const isLoading = status === 'loading';

  // Refresh the balance whenever a payment succeeds elsewhere in the app.
  useEffect(() => onAppEvent(APP_EVENTS.balanceRefresh, () => void refresh()), [refresh]);

  // Fund the account via Friendbot, then reload the balance.
  async function handleFund() {
    setIsFunding(true);
    try {
      await fundWithFriendbot(address);
      notify('Account funded with test XLM', 'success');
      await refresh();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : 'Funding failed',
        'error'
      );
    } finally {
      setIsFunding(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Register Cash Balance"
        subtitle="Register native funds · Testnet"
        icon={WalletIcon}
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            isLoading={isLoading}
            leftIcon={!isLoading ? RefreshIcon : undefined}
            aria-label="Refresh balance"
          >
            Refresh
          </Button>
        }
      />

      {/* Balance body */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}

      {!isLoading && status === 'error' && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
          <p className="text-sm text-rose-300">{error}</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-3"
            onClick={handleFund}
            isLoading={isFunding}
          >
            {isFunding ? 'Funding…' : '🚀 Fund with Friendbot'}
          </Button>
        </div>
      )}

      {!isLoading && status === 'success' && balance && (
        <div className="animate-fade-in">
          <div className="flex items-end gap-2">
            <span className="bg-gradient-to-r from-white to-brand-200 bg-clip-text text-5xl font-black tracking-tight text-transparent">
              {formatXlm(balance.xlm)}
            </span>
            <span className="mb-1 text-lg font-semibold text-slate-400">XLM</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="font-mono text-slate-300">
              {truncateAddress(address, 6)}
            </span>
            <CopyButton value={address} label="Address" className="h-6 w-6" />
            <a
              href={explorerAccountUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded-lg border border-slate-700 px-2 py-1 text-xs text-brand-300 transition hover:bg-slate-700/50"
            >
              View on Explorer ↗
            </a>
          </div>
        </div>
      )}

      {!isLoading && status === 'idle' && (
        <p className="text-sm text-slate-400">
          Connect your wallet to view your balance.
        </p>
      )}
    </Card>
  );
}
