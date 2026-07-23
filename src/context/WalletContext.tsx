/**
 * Wallet context — owns the connection lifecycle for Freighter and exposes
 * the connected address plus connect/disconnect actions to the whole app.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  connectWallet,
  getConnectedAddress,
  isFreighterInstalled,
  checkNetwork,
  watchWalletChanges,
} from '@/services/freighter';
import { useToast } from '@/context/ToastContext';

interface WalletContextValue {
  address: string;
  isConnected: boolean;
  isInstalled: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast();
  const [address, setAddress] = useState('');
  const [isInstalled, setIsInstalled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  // On mount: detect Freighter and silently restore an existing session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const installed = await isFreighterInstalled();
      if (cancelled) return;
      setIsInstalled(installed);
      if (!installed) return;

      const existing = await getConnectedAddress();
      if (!cancelled && existing) setAddress(existing);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // While connected, keep our address in sync with Freighter's active account.
  // If the user switches accounts in the extension, update automatically; if
  // they lock/remove access, clear the session.
  useEffect(() => {
    if (!address) return;
    const stop = watchWalletChanges((next) => {
      setAddress((prev) => {
        if (next && next !== prev) {
          notify('Active account changed in Freighter', 'info');
          return next;
        }
        return prev;
      });
    });
    return stop;
  }, [address, notify]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const pubKey = await connectWallet();
      setAddress(pubKey);

      // Warn (but don't block) if the wallet is on the wrong network.
      const networkWarning = await checkNetwork();
      if (networkWarning) {
        notify(networkWarning, 'error');
      } else {
        notify('Wallet connected', 'success');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect wallet';
      notify(message, 'error');
      if (message.toLowerCase().includes('not installed')) {
        setIsInstalled(false);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [notify]);

  const disconnect = useCallback(() => {
    // Freighter has no programmatic disconnect; we simply clear local state.
    setAddress('');
    notify('Wallet disconnected', 'info');
  }, [notify]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: Boolean(address),
        isInstalled,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

/** Access wallet state and actions. */
// eslint-disable-next-line react-refresh/only-export-components
export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
