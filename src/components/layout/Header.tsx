/**
 * App header — brand mark, network badge, and wallet connect control.
 */
import { NETWORK_LABEL } from '@/config/stellar';
import { WalletConnect } from '@/components/wallet/WalletConnect';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-black text-white shadow-glow">
            ✦
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-100 sm:text-lg">
              LumenLink POS
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {NETWORK_LABEL}
            </span>
          </div>
        </div>

        <WalletConnect />
      </div>
    </header>
  );
}
