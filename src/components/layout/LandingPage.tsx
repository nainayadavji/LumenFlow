import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Button } from '@/components/ui/Button';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface LandingPageProps {
  onExplorePoll?: () => void;
}

export function LandingPage({ onExplorePoll }: LandingPageProps) {
  const { connect, isConnecting, isInstalled } = useWallet();

  // POS Simulator State
  const [simState, setSimState] = useState<'typing' | 'clicking' | 'processing' | 'success'>('typing');
  const [simAddress, setSimAddress] = useState('');
  const [simAmount, setSimAmount] = useState('');
  const [simMemo, setSimMemo] = useState('');
  const [simBalance, setSimBalance] = useState(1050.25);
  const [balanceHighlight, setBalanceHighlight] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const runSimulation = async () => {
      while (isMounted) {
        // Reset states
        setSimState('typing');
        setSimAddress('');
        setSimAmount('');
        setSimMemo('');
        setSimBalance(1050.25);
        setBalanceHighlight(false);
        await sleep(1500);
        if (!isMounted) return;

        // Simulate typing customer address
        const addr = 'GDI4GQSJKBRCWYWYQQG5DFSOLZJTRBW7A65N26M3NL7E3DOL5SND4OUN';
        const displayAddr = `${addr.slice(0, 6)}...${addr.slice(-6)}`;
        for (let i = 0; i <= displayAddr.length; i++) {
          setSimAddress(displayAddr.slice(0, i));
          await sleep(60);
          if (!isMounted) return;
        }
        await sleep(600);

        // Simulate typing amount
        const amountStr = '25.00';
        for (let i = 0; i <= amountStr.length; i++) {
          setSimAmount(amountStr.slice(0, i));
          await sleep(80);
          if (!isMounted) return;
        }
        await sleep(600);

        // Simulate typing receipt memo
        const memoStr = 'Table 4 - Coffee & Croissant';
        for (let i = 0; i <= memoStr.length; i++) {
          setSimMemo(memoStr.slice(0, i));
          await sleep(40);
          if (!isMounted) return;
        }
        await sleep(1000);

        // Trigger Click state
        setSimState('clicking');
        await sleep(250);
        if (!isMounted) return;

        // Processing state (simulate Freighter check + Horizon submit)
        setSimState('processing');
        await sleep(2200);
        if (!isMounted) return;

        // Success state
        setSimState('success');
        setSimBalance(1075.25); // increment balance
        setBalanceHighlight(true);

        await sleep(6000); // keep receipt visible before restarting
      }
    };

    runSimulation();

    return () => {
      isMounted = false;
    };
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-brand-400">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      title: '3-Second Settle',
      desc: 'Process payments at the speed of retail. Transactions settle in seconds, letting merchants serve clients without delay.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-emerald-400">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
          <path d="M12 6v12" />
        </svg>
      ),
      title: 'Sub-Cent Fees',
      desc: 'Eliminate credit card transaction fees. Settle micro-payments and standard retail transactions for less than $0.0001 per payment.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-indigo-400">
          <path d="M7 2v20M17 2v20M2 12h20" />
        </svg>
      ),
      title: 'Stellar Path Payments',
      desc: 'The ultimate buyer flexibility. Customers can pay in any asset they choose (like XLM), while the merchant automatically receives USDC.',
    },
  ];

  return (
    <section className="animate-fade-in py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-100 sm:text-5xl md:text-6xl">
          The Web3 Cash Register for{' '}
          <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            Local Commerce
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
          LumenLink POS turns your Freighter wallet into a sleek, secure point-of-sale register. Settle payments, monitor cash flow, and charge clients instantly.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!isInstalled ? (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" variant="primary">
                Install Freighter Wallet ↗
              </Button>
            </a>
          ) : (
            <Button size="lg" variant="primary" onClick={connect} isLoading={isConnecting}>
              Connect Wallet & Launch POS
            </Button>
          )}

          {onExplorePoll && (
            <Button size="lg" variant="secondary" onClick={onExplorePoll}>
              Explore Soroban Poll 🔮
            </Button>
          )}
        </div>
      </div>

      {/* Interactive POS Frame Mockup */}
      <div className="relative mx-auto mt-14 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/30 p-5 shadow-2xl shadow-brand-500/10 backdrop-blur-xl transition duration-500 hover:border-slate-700/80">
        <div className="absolute -top-12 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs text-slate-500">lumenlink-terminal-v1.0.0</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded bg-slate-950 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-ping" />
            LIVE SIMULATION
          </span>
        </div>

        {/* Two Column POS Interface */}
        <div className="grid gap-6 py-6 md:grid-cols-2">
          
          {/* POS Cash Register Side */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">POS Checkout</span>
              <span className="text-[10px] text-slate-500">Register ID #104</span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Address input */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">Customer Address</label>
                <div className="relative flex items-center h-10 w-full rounded-lg bg-slate-900 border border-slate-800/60 px-3 font-mono text-xs text-slate-300">
                  <span>{simAddress}</span>
                  {simState === 'typing' && simAddress.length < 16 && (
                    <span className="ml-0.5 inline-block w-1 h-3 bg-brand-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">Charge Amount</label>
                <div className="relative flex items-center justify-between h-10 w-full rounded-lg bg-slate-900 border border-slate-800/60 px-3 text-xs text-slate-300 font-mono">
                  <div className="flex items-center">
                    <span>{simAmount}</span>
                    {simState === 'typing' && simAddress.length >= 16 && simAmount.length < 5 && (
                      <span className="ml-0.5 inline-block w-1 h-3 bg-brand-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-brand-300 font-bold">XLM</span>
                </div>
              </div>

              {/* Receipt Memo */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">Receipt Memo</label>
                <div className="relative flex items-center h-10 w-full rounded-lg bg-slate-900 border border-slate-800/60 px-3 text-xs text-slate-300">
                  <span>{simMemo}</span>
                  {simState === 'typing' && simAmount.length >= 5 && (
                    <span className="ml-0.5 inline-block w-1 h-3 bg-brand-400 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled
                className={`relative flex items-center justify-center w-full h-11 rounded-lg text-xs font-bold transition duration-300 ${
                  simState === 'typing'
                    ? 'bg-slate-900 text-slate-500 border border-slate-800'
                    : simState === 'clicking'
                    ? 'bg-brand-500 text-white scale-[0.98]'
                    : simState === 'processing'
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'bg-emerald-600 text-white font-bold'
                }`}
              >
                {simState === 'typing' && 'Filling Details...'}
                {simState === 'clicking' && 'Clicking...'}
                {simState === 'processing' && (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing & Settling...
                  </span>
                )}
                {simState === 'success' && 'Charge Approved! ✓'}
              </button>
            </div>
          </div>

          {/* POS Dashboard/Receipt Side */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5 shadow-inner">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Terminal Register</span>
                <span className="text-[10px] text-slate-500">Register ID #105</span>
              </div>

              {/* Register Balance card */}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Register Funds</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className={`font-mono text-3xl font-black transition duration-500 tracking-tight ${
                    balanceHighlight ? 'text-emerald-400 scale-105' : 'text-slate-100'
                  }`}>
                    {simBalance.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">XLM</span>
                </div>
              </div>
            </div>

            {/* Receipt view or Terminal Logs */}
            <div className="mt-6 flex-1 flex flex-col justify-end min-h-[140px]">
              {simState === 'success' ? (
                // Beautiful Paper Receipt
                <div className="animate-fade-in rounded-lg bg-white p-4 text-slate-900 shadow-xl font-mono text-[10px] border-t-4 border-emerald-500">
                  <div className="text-center font-bold text-[11px] border-b border-slate-200 pb-2">
                    LUMENLINK POS RECEIPT
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant Account:</span>
                      <span className="font-bold">nainayadavji</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer Address:</span>
                      <span>GDI4GQ...4OUN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Description:</span>
                      <span className="truncate max-w-[120px]">Table 4 - Coffee</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-slate-950">
                      <span>Total Paid:</span>
                      <span>25.00 XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-600 font-bold">SETTLED (3.2s)</span>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-dashed border-slate-300 pt-2 text-center text-[8px] text-slate-400 select-all font-mono">
                    HASH: 8313f43dc7c7...cf140
                  </div>
                </div>
              ) : (
                // Mock dashboard analytics / recent charges log
                <div className="space-y-2 opacity-85">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Recent Register Sales</span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 text-xs border border-slate-900/50">
                    <span className="text-slate-300 font-medium">Table 1 — Pasta & Soda</span>
                    <span className="font-mono text-slate-400 font-semibold">+45.00 XLM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 text-xs border border-slate-900/50">
                    <span className="text-slate-300 font-medium">Table 3 — Espresso</span>
                    <span className="font-mono text-slate-400 font-semibold">+12.50 XLM</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="mx-auto mt-16 max-w-4xl border-t border-slate-800/60 pt-16">
        <h2 className="text-center text-2xl font-bold text-slate-200">Built for Modern Global Commerce</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {features.map((feat, index) => (
            <div key={index} className="rounded-xl border border-slate-800/40 bg-slate-900/20 p-6 transition duration-300 hover:border-slate-800 hover:bg-slate-900/40">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-900/60 border border-slate-800/80">
                {feat.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-200">{feat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
