import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function PayVault() {
  const { notify } = useToast();
  const [principal, setPrincipal] = useState<number>(1000);
  const [accruedYield, setAccruedYield] = useState<number>(0);
  const [totalHarvested, setTotalHarvested] = useState<number>(45.82);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Tick up the yield in real-time to show visual premium engagement
  useEffect(() => {
    if (principal <= 0) return;
    const interval = setInterval(() => {
      setAccruedYield((prev) => prev + (principal * 0.00000008));
    }, 1000);
    return () => clearInterval(interval);
  }, [principal]);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      notify('Please enter a valid deposit amount.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      // Simulate/Trigger Testnet transaction or contract call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPrincipal((prev) => prev + Number(amount));
      setAmount('');
      notify(`Successfully deposited ${amount} XLM into PayVault!`, 'success');
    } catch (e) {
      notify('Failed to complete deposit.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      notify('Please enter a valid withdrawal amount.', 'error');
      return;
    }
    if (Number(amount) > principal) {
      notify('Insufficient vault balance.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPrincipal((prev) => prev - Number(amount));
      setAmount('');
      notify(`Successfully withdrew ${amount} XLM from PayVault!`, 'success');
    } catch (e) {
      notify('Failed to complete withdrawal.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHarvest = async () => {
    if (accruedYield <= 0) {
      notify('No accrued yield to harvest.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setTotalHarvested((prev) => prev + accruedYield);
      setPrincipal((prev) => prev + accruedYield);
      setAccruedYield(0);
      notify('Yield successfully harvested and compound-invested!', 'success');
    } catch (e) {
      notify('Failed to harvest yield.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      <Card>
        <CardHeader
          title="LumenLink Yield Vault"
          subtitle="DeFi Yield POS Register Vault"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
        />

        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Deposited Principal</p>
              <p className="mt-1 text-2xl font-black text-white">{principal.toFixed(2)} XLM</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Harvested</p>
              <p className="mt-1 text-2xl font-black text-emerald-400">{totalHarvested.toFixed(4)} XLM</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Accruing Yield (8% APY)</p>
              <p className="mt-1 text-2xl font-black text-brand-400 font-mono">+{accruedYield.toFixed(8)} XLM</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleHarvest}
              isLoading={isLoading}
              className="bg-brand-500 hover:bg-brand-600 text-xs shadow-glow"
            >
              🌾 Harvest
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Deposit & Withdraw"
          subtitle="Manage your locked register liquidity"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            </svg>
          }
        />

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Amount (XLM)
            </label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              variant="primary"
              onClick={handleDeposit}
              isLoading={isLoading}
              className="bg-brand-500 hover:bg-brand-600"
            >
              📥 Deposit
            </Button>
            <Button
              variant="secondary"
              onClick={handleWithdraw}
              isLoading={isLoading}
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              📤 Withdraw
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
