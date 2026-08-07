/**
 * App header — brand mark, navigation tabs (POS / Poll), network badge, and wallet connect.
 */
import { NETWORK_LABEL } from '@/config/stellar';
import { WalletConnect } from '@/components/wallet/WalletConnect';

interface HeaderProps {
  activeTab?: 'pos' | 'poll' | 'payvault' | 'anchor' | 'analytics' | 'feedback';
  setActiveTab?: (tab: 'pos' | 'poll' | 'payvault' | 'anchor' | 'analytics' | 'feedback') => void;
}

export function Header({ activeTab = 'pos', setActiveTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab?.('pos')}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-black text-white shadow-glow">
              ✦
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight text-slate-100 sm:text-lg">
                LumenLink POS
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {NETWORK_LABEL}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          {setActiveTab && (
            <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'pos'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🛒 Merchant POS
              </button>
              <button
                onClick={() => setActiveTab('payvault')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'payvault'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💰 PayVault
              </button>
              <button
                onClick={() => setActiveTab('anchor')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'anchor'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚓ Anchor Out
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'analytics'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📊 Diagnostics
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'feedback'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                💬 Feedback
              </button>
              <button
                onClick={() => setActiveTab('poll')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'poll'
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔮 Live Poll
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Tab Toggle */}
          {setActiveTab && (
            <div className="flex lg:hidden items-center gap-1 text-xs">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 font-semibold outline-none"
              >
                <option value="pos">🛒 POS</option>
                <option value="payvault">💰 PayVault</option>
                <option value="anchor">⚓ Anchor Out</option>
                <option value="analytics">📊 Diagnostics</option>
                <option value="feedback">💬 Feedback</option>
                <option value="poll">🔮 Poll</option>
              </select>
            </div>
          )}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
