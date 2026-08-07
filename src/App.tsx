/**
 * Root application component. Composes the layout, navigation tabs, and features.
 */
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useWallet } from '@/context/WalletContext';
import { Header } from '@/components/layout/Header';
import { LandingPage } from '@/components/layout/LandingPage';
import { Footer } from '@/components/layout/Footer';
import { BalanceCard } from '@/components/balance/BalanceCard';
import { SendTransaction } from '@/components/transaction/SendTransaction';
import { LivePoll } from '@/components/poll/LivePoll';
import { PayVault } from '@/components/pos/PayVault';
import { AnchorSettlement } from '@/components/pos/AnchorSettlement';
import { AnalyticsTelemetry } from '@/components/analytics/AnalyticsTelemetry';
import { UserFeedback } from '@/components/feedback/UserFeedback';

type TabType = 'pos' | 'poll' | 'payvault' | 'anchor' | 'analytics' | 'feedback';

export default function App() {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('pos');

  const renderContent = () => {
    switch (activeTab) {
      case 'poll':
        return <LivePoll />;
      case 'payvault':
        return <PayVault />;
      case 'anchor':
        return <AnchorSettlement />;
      case 'analytics':
        return <AnalyticsTelemetry />;
      case 'feedback':
        return <UserFeedback />;
      case 'pos':
      default:
        return (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
                ⚡ Active POS Terminal · Testnet
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-100 sm:text-4xl">
                Merchant Register
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Create charges, monitor your cash register balance, and submit transactions instantly.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <BalanceCard />
              <SendTransaction />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {!isConnected && activeTab !== 'poll' && activeTab !== 'analytics' && activeTab !== 'feedback' ? (
            <LandingPage onExplorePoll={() => setActiveTab('poll')} />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      <Footer />
      <Analytics />
    </div>
  );
}
