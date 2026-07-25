import { useState, useEffect, useCallback } from 'react';
import {
  fetchPollQuestion,
  fetchPollResults,
  checkHasVoted,
  buildVoteTransaction,
  submitVoteTransaction,
  fetchVoteEvents,
  type PollResults,
  type VoteCastEvent,
} from '@/services/poll';
import { useWallet } from '@/context/WalletContext';
import { STELLAR_CONFIG } from '@/config/stellar';

export type TxState = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export interface PollContractState {
  question: string;
  results: PollResults;
  hasVoted: boolean;
  userChoice: boolean | null;
  events: VoteCastEvent[];
  isLoading: boolean;
  txState: TxState;
  txHash: string;
  errorMessage: string;
  vote: (choice: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export function usePollContract(): PollContractState {
  const { address, isConnected, signTransaction } = useWallet();

  const [question, setQuestion] = useState<string>('Is Soroban the future of smart contracts on Stellar?');
  const [results, setResults] = useState<PollResults>({ yes: 0, no: 0 });
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [events, setEvents] = useState<VoteCastEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [txState, setTxState] = useState<TxState>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const refresh = useCallback(async () => {
    try {
      const [q, res, evts] = await Promise.all([
        fetchPollQuestion(),
        fetchPollResults(),
        fetchVoteEvents(),
      ]);

      setQuestion(q);
      setResults(res);
      setEvents(evts);

      if (address) {
        const voted = await checkHasVoted(address);
        setHasVoted(voted);

        // Find user's choice in recent events if available
        const userEvt = evts.find((e) => e.voter.toLowerCase() === address.toLowerCase());
        if (userEvt) {
          setUserChoice(userEvt.choice);
        }
      } else {
        setHasVoted(false);
        setUserChoice(null);
      }
    } catch (err) {
      console.error('Error refreshing poll contract state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Sync state on load and address changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Real-time event polling every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchVoteEvents().then((evts) => {
        if (evts.length > 0) {
          setEvents(evts);
          // Auto update results from newest event if present
          const latest = evts[0];
          setResults({ yes: latest.yes, no: latest.no });
        }
      });
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const castVote = useCallback(
    async (choice: boolean) => {
      setErrorMessage('');
      setTxHash('');

      // Error Type 1: Wallet not connected or not found
      if (!isConnected || !address) {
        setTxState('error');
        setErrorMessage('Wallet Not Found / Connected: Please connect your Stellar wallet first.');
        return;
      }

      // Error Type 2: Guard against already voted client-side
      if (hasVoted) {
        setTxState('error');
        setErrorMessage('Already Voted: Your address has already cast a vote in this poll.');
        return;
      }

      try {
        // Step 1: Building Transaction
        setTxState('building');
        const xdr = await buildVoteTransaction(address, choice);

        // Step 2: Awaiting User Signature
        setTxState('signing');
        let signedXdr: string;
        try {
          signedXdr = await signTransaction(xdr, STELLAR_CONFIG.networkPassphrase);
        } catch (signErr) {
          // Error Type 3: User Rejected / Cancelled Transaction
          const signMsg = signErr instanceof Error ? signErr.message : String(signErr);
          throw new Error(`User Rejected: Transaction signing was rejected by user. (${signMsg})`);
        }

        // Step 3: Submitting to Network
        setTxState('submitting');
        const { hash, results: updatedResults } = await submitVoteTransaction(signedXdr);

        setTxHash(hash);
        setTxState('success');
        setHasVoted(true);
        setUserChoice(choice);

        if (updatedResults) {
          setResults(updatedResults);
        }

        // Refresh events and tallies
        await refresh();
      } catch (err) {
        setTxState('error');
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
      }
    },
    [address, isConnected, hasVoted, signTransaction, refresh]
  );

  return {
    question,
    results,
    hasVoted,
    userChoice,
    events,
    isLoading,
    txState,
    txHash,
    errorMessage,
    vote: castVote,
    refresh,
  };
}
