/**
 * useBalance — encapsulates fetching, loading, error and refresh state for an
 * account's XLM balance.
 */
import { useCallback, useEffect, useState } from 'react';
import { fetchBalance } from '@/services/stellar';
import type { AccountBalance, Status } from '@/types';

interface UseBalanceResult {
  balance: AccountBalance | null;
  status: Status;
  error: string;
  refresh: () => Promise<void>;
}

export function useBalance(address: string): UseBalanceResult {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!address) {
      setBalance(null);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const result = await fetchBalance(address);
      setBalance(result);
      setStatus('success');
    } catch (err) {
      setBalance(null);
      setError(err instanceof Error ? err.message : 'Failed to load balance');
      setStatus('error');
    }
  }, [address]);

  // Auto-load whenever the address changes.
  useEffect(() => {
    void load();
  }, [load]);

  return { balance, status, error, refresh: load };
}
