import React from 'react';

export interface WalletOption {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  isPopular?: boolean;
  installed?: boolean;
}

export const SUPPORTED_WALLETS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter Wallet',
    type: 'Browser Extension',
    icon: '🚀',
    description: 'Official Stellar browser extension wallet by SDF.',
    isPopular: true,
    installed: true,
  },
  {
    id: 'lobstr',
    name: 'LOBSTR Wallet',
    type: 'Mobile & Web',
    icon: '🦞',
    description: 'Popular mobile & web wallet for Stellar assets and Soroban.',
    isPopular: true,
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    type: 'Browser Extension',
    icon: '⚡',
    description: 'Powerful DeFi wallet built specifically for Stellar.',
  },
  {
    id: 'albedo',
    name: 'Albedo Wallet',
    type: 'Web / Passkey',
    icon: '🌌',
    description: 'Web-based sign-in requiring no extension installation.',
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    type: 'Browser Extension',
    icon: '🌸',
    description: 'Multi-chain Web3 wallet supporting Soroban smart contracts.',
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => Promise<void>;
  isConnecting: boolean;
  selectedWalletId?: string;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
  isConnecting,
  selectedWalletId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-brand-500/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
              StellarWalletsKit · Multi-Wallet
            </span>
            <h3 className="text-xl font-bold text-slate-100 mt-0.5">Select a Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Options List */}
        <div className="mt-4 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => onSelectWallet(wallet.id)}
              disabled={isConnecting}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition duration-200 ${
                selectedWalletId === wallet.id
                  ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500'
                  : 'border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
              } ${isConnecting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl flex items-center justify-center h-10 w-10 rounded-lg bg-slate-900 border border-slate-800">
                  {wallet.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100">{wallet.name}</span>
                    {wallet.isPopular && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{wallet.description}</span>
                </div>
              </div>
              <div className="pl-2">
                <span className="text-xs font-mono text-slate-500">{wallet.type}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-5 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Stellar Testnet Enabled
          </span>
          <span className="font-mono text-slate-500">StellarWalletsKit v2</span>
        </div>
      </div>
    </div>
  );
};
