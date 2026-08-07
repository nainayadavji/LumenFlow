import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function AnchorSettlement() {
  const { notify } = useToast();
  const [fiatCurrency, setFiatCurrency] = useState<'USD' | 'EUR' | 'INR'>('USD');
  const [amount, setAmount] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [step, setStep] = useState<'details' | 'kyc' | 'complete'>('details');

  const handleCashout = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      notify('Please enter a valid cashout amount.', 'error');
      return;
    }
    if (!bankAccount) {
      notify('Please specify your target bank account details.', 'error');
      return;
    }
    setStep('kyc');
  };

  const handleKYCConfirm = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setStep('complete');
      notify('Anchor off-ramp request completed successfully!', 'success');
    }, 2000);
  };

  const resetFlow = () => {
    setAmount('');
    setBankAccount('');
    setStep('details');
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Card>
        <CardHeader
          title="Anchor Fiat Settlement (SEP-24)"
          subtitle="Off-ramp directly to regional fiat bank accounts"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        {step === 'details' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Target Fiat Currency
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(['USD', 'EUR', 'INR'] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setFiatCurrency(curr)}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
                      fiatCurrency === curr
                        ? 'border-brand-500 bg-brand-500/10 text-brand-300'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {curr} Off-Ramp
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Amount to Cash Out (USDC / XLM)
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                IBAN / Routing / Bank Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. DE89 3704 0044 0532 0130 00"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-brand-500"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleCashout}
              className="w-full bg-brand-500 hover:bg-brand-600 mt-2"
            >
              Initiate Bank Settlement
            </Button>
          </div>
        )}

        {step === 'kyc' && (
          <div className="space-y-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-between rounded-full bg-yellow-500/10 text-yellow-400 p-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Anchor Identity Check (SEP-10 Auth)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Anchor requires identity verification for {fiatCurrency} transactions. Click confirm to simulate the instant interactive KYC authorization window.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setStep('details')}
                className="w-1/2 border-slate-700 text-slate-300"
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleKYCConfirm}
                isLoading={isSimulating}
                className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-slate-950"
              >
                Authorize & Settle
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-5 text-center animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Settlement Initiated!</h3>
              <p className="mt-2 text-sm text-slate-400">
                Your settlement of <strong className="text-white">{amount} USDC</strong> to bank account ending in <strong className="text-white">{bankAccount.slice(-4)}</strong> has been processed via Stellar Testnet Anchor.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={resetFlow}
              className="w-full border-slate-700 text-slate-300"
            >
              Start New Settlement
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
