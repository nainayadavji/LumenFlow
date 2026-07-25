import React from 'react';
import type { TxState } from '@/hooks/usePollContract';
import { explorerTxUrl } from '@/config/stellar';

interface TxStatusBadgeProps {
  state: TxState;
  hash?: string;
  errorMessage?: string;
}

export const TxStatusBadge: React.FC<TxStatusBadgeProps> = ({ state, hash, errorMessage }) => {
  if (state === 'idle') return null;

  return (
    <div className="mt-4 rounded-xl border p-4 text-xs font-mono transition duration-300 animate-fade-in">
      {state === 'building' && (
        <div className="flex items-center gap-3 border-amber-500/30 bg-amber-500/10 p-3 rounded-lg text-amber-300">
          <svg className="h-4 w-4 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>[1/3] Building Soroban Contract Invocation Transaction...</span>
        </div>
      )}

      {state === 'signing' && (
        <div className="flex items-center gap-3 border-blue-500/30 bg-blue-500/10 p-3 rounded-lg text-blue-300">
          <svg className="h-4 w-4 animate-bounce text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4" />
          </svg>
          <span>[2/3] Awaiting Wallet Signature... Please approve in your wallet extension.</span>
        </div>
      )}

      {state === 'submitting' && (
        <div className="flex items-center gap-3 border-indigo-500/30 bg-indigo-500/10 p-3 rounded-lg text-indigo-300">
          <svg className="h-4 w-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>[3/3] Submitting to Soroban Testnet RPC & Polling Ledger...</span>
        </div>
      )}

      {state === 'success' && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 rounded-xl text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-200">
            <span>✓ Vote Recorded On-Chain Successfully!</span>
          </div>
          {hash && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-300">
              <span className="truncate">Hash: <code className="text-emerald-400">{hash}</code></span>
              <a
                href={explorerTxUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-brand-300 hover:text-brand-200 underline"
              >
                View on Stellar Expert ↗
              </a>
            </div>
          )}
        </div>
      )}

      {state === 'error' && (
        <div className="border border-rose-500/40 bg-rose-500/10 p-4 rounded-xl text-rose-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-200">
            <span>⚠️ Transaction Error</span>
          </div>
          <p className="text-xs text-rose-200 font-sans mt-1">
            {errorMessage || 'An error occurred while calling the Soroban smart contract.'}
          </p>
        </div>
      )}
    </div>
  );
};
