/**
 * SendTransaction — form to send native XLM on the Testnet. Handles client-side
 * validation, submission state, and a rich success panel with the transaction
 * hash, copy button and explorer link.
 */
import { useState, type FormEvent } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/context/ToastContext';
import { sendPayment, parseHorizonError } from '@/services/stellar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CopyButton } from '@/components/ui/CopyButton';
import { isValidAmount, isValidPublicKey, truncateAddress } from '@/utils/format';
import { explorerTxUrl } from '@/config/stellar';
import { APP_EVENTS, emitAppEvent } from '@/utils/events';
import type { Status, TransactionResult } from '@/types';

const SendIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export function SendTransaction() {
  const { address, isConnected } = useWallet();
  const { notify } = useToast();

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [errors, setErrors] = useState<{ destination?: string; amount?: string }>({});

  const isSubmitting = status === 'loading';

  function validate(): boolean {
    const next: typeof errors = {};
    if (!isValidPublicKey(destination)) {
      next.destination = 'Enter a valid Stellar public key (starts with G).';
    }
    if (destination.trim() === address) {
      next.destination = 'You cannot send XLM to your own address.';
    }
    if (!isValidAmount(amount)) {
      next.amount = 'Enter an amount greater than 0.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setResult(null);
    try {
      const tx = await sendPayment(address, destination.trim(), amount.trim(), memo);
      setResult(tx);
      setStatus('success');
      notify('Charge settled successfully!', 'success');
      // Ask the balance card to refresh now that funds have moved.
      emitAppEvent(APP_EVENTS.balanceRefresh);
      // Reset the form inputs, keep the success panel.
      setDestination('');
      setAmount('');
      setMemo('');
    } catch (err) {
      const message = parseHorizonError(err);
      setStatus('error');
      notify(message, 'error');
    }
  }

  return (
    <Card>
      <CardHeader title="POS Checkout" subtitle="Settle Testnet payment" icon={SendIcon} />

      {!isConnected ? (
        <p className="text-sm text-slate-400">
          Connect your wallet to open checkout register.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer address"
            name="destination"
            placeholder="GABC…"
            autoComplete="off"
            spellCheck={false}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            error={errors.destination}
          />

          <Input
            label="Charge Amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.0000001"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            suffix="XLM"
          />

          <Input
            label="Receipt Memo (optional)"
            name="memo"
            placeholder="e.g. Table 4 - Coffee"
            maxLength={28}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            hint="Text memo, up to 28 characters."
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isSubmitting}
            leftIcon={!isSubmitting ? SendIcon : undefined}
          >
            {isSubmitting ? 'Processing Charge…' : 'Process Charge'}
          </Button>
        </form>
      )}

      {/* Success panel with transaction hash + explorer link */}
      {status === 'success' && result && (
        <div className="mt-5 animate-fade-in rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20">
              ✓
            </span>
            <span className="font-semibold">Receipt Generated / Payment Settled</span>
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Transaction hash
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-slate-900/70 px-3 py-2 font-mono text-sm text-slate-200">
                {truncateAddress(result.hash, 8)}
              </code>
              <CopyButton value={result.hash} label="Hash" />
            </div>
          </div>

          <a
            href={explorerTxUrl(result.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-500"
          >
            View on Stellar Expert ↗
          </a>
        </div>
      )}
    </Card>
  );
}
