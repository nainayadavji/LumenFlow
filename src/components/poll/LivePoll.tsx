import React from 'react';
import { usePollContract } from '@/hooks/usePollContract';
import { useWallet } from '@/context/WalletContext';
import { TxStatusBadge } from './TxStatusBadge';
import { STELLAR_CONFIG } from '@/config/stellar';

export const LivePoll: React.FC = () => {
  const { address, isConnected, openWalletModal, activeWalletName } = useWallet();
  const {
    question,
    results,
    hasVoted,
    userChoice,
    events,
    isLoading,
    txState,
    txHash,
    errorMessage,
    vote,
    refresh,
  } = usePollContract();

  const totalVotes = results.yes + results.no;
  const yesPercent = totalVotes > 0 ? Math.round((results.yes / totalVotes) * 100) : 0;
  const noPercent = totalVotes > 0 ? Math.round((results.no / totalVotes) * 100) : 0;

  const isBusy = txState === 'building' || txState === 'signing' || txState === 'submitting';

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 font-mono">
                🔮 Soroban Smart Contract
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Stellar Testnet
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-100 mt-2">Live Governance Poll</h2>
            <p className="text-xs text-slate-400 mt-1">
              On-chain smart contract poll running on Soroban. Votes are immutable & published via real-time events.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={isLoading}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition flex items-center gap-2"
          >
            <svg className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync State
          </button>
        </div>

        {/* Contract Metadata Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Contract Address</span>
            <a
              href={`${STELLAR_CONFIG.explorerUrl}/contract/${STELLAR_CONFIG.pollContractId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-300 hover:underline truncate block mt-0.5"
            >
              {STELLAR_CONFIG.pollContractId.slice(0, 10)}...{STELLAR_CONFIG.pollContractId.slice(-10)} ↗
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Connected Wallet</span>
              <span className="text-slate-200 mt-0.5 block font-sans font-medium">
                {isConnected ? `${activeWalletName} (${address.slice(0, 4)}...${address.slice(-4)})` : 'Not Connected'}
              </span>
            </div>
            {!isConnected && (
              <button
                onClick={openWalletModal}
                className="px-3 py-1.5 rounded-lg bg-brand-500 text-white font-sans text-xs font-bold hover:bg-brand-400 transition"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Poll Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto py-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
            On-Chain Question #1
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2 leading-tight">
            &ldquo;{question}&rdquo;
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Total Votes Cast: <strong className="text-slate-200 font-mono">{totalVotes}</strong>
          </p>
        </div>

        {/* Results Progress Bars */}
        <div className="mt-6 space-y-4 max-w-2xl mx-auto">
          {/* YES Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span>YES</span>
                {userChoice === true && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono border border-emerald-500/30">
                    YOUR VOTE ✓
                  </span>
                )}
              </span>
              <span className="font-mono text-emerald-400">{results.yes} votes ({yesPercent}%)</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 rounded-full"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
          </div>

          {/* NO Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span>NO</span>
                {userChoice === false && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono border border-rose-500/30">
                    YOUR VOTE ✓
                  </span>
                )}
              </span>
              <span className="font-mono text-rose-400">{results.no} votes ({noPercent}%)</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-700 rounded-full"
                style={{ width: `${noPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-2xl mx-auto">
          {!isConnected ? (
            <div className="text-center space-y-3">
              <p className="text-xs text-amber-300 font-mono">
                ⚠️ Connect a wallet to cast your vote on Soroban Testnet.
              </p>
              <button
                onClick={openWalletModal}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:from-brand-400 hover:to-indigo-500 transition duration-200"
              >
                Connect Wallet to Vote
              </button>
            </div>
          ) : hasVoted ? (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center text-emerald-300 text-xs font-mono space-y-1">
              <span className="font-bold text-sm block text-emerald-200">✓ You have already voted!</span>
              <p className="text-slate-400 text-[11px] font-sans">
                Soroban enforces 1 vote per account on-chain. Second attempts return <code>Error::AlreadyVoted (#2)</code>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => vote(true)}
                disabled={isBusy}
                className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBusy ? 'Processing...' : 'Vote YES 👍'}
              </button>

              <button
                onClick={() => vote(false)}
                disabled={isBusy}
                className="h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/20 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBusy ? 'Processing...' : 'Vote NO 👎'}
              </button>
            </div>
          )}

          {/* Status Badge & Handled Error Feedback */}
          <TxStatusBadge state={txState} hash={txHash} errorMessage={errorMessage} />
        </div>
      </div>

      {/* Real-time Event Stream Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Soroban Event Stream
            </h4>
            <span className="text-[11px] text-slate-500">
              Live <code>VoteCast</code> events polled from Soroban RPC
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">{events.length} Events Logged</span>
        </div>

        <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto font-mono text-xs pr-1">
          {events.length === 0 ? (
            <div className="p-4 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No recent contract events detected. Cast a vote to trigger an on-chain event!
            </div>
          ) : (
            events.map((evt, idx) => (
              <div
                key={`${evt.voter}-${evt.ledger}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${evt.choice ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                    {evt.choice ? 'YES' : 'NO'}
                  </span>
                  <span className="text-slate-300">
                    Voter: {evt.voter.slice(0, 6)}...{evt.voter.slice(-6)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>Tallies: <span className="text-emerald-400">Y:{evt.yes}</span> / <span className="text-rose-400">N:{evt.no}</span></span>
                  <span className="text-slate-500">Ledger #{evt.ledger}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
