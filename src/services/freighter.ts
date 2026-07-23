/**
 * Thin wrapper around the Freighter browser-wallet API.
 *
 * Centralising these calls keeps the rest of the app decoupled from the
 * `@stellar/freighter-api` surface and makes the intent of each call explicit.
 *
 * @see https://docs.freighter.app/docs/guide/introduction
 */
import {
  isConnected,
  isAllowed,
  requestAccess,
  getAddress,
  getNetworkDetails,
  signTransaction,
  WatchWalletChanges,
} from '@stellar/freighter-api';
import { STELLAR_CONFIG } from '@/config/stellar';

/** Turn raw Freighter error strings into friendlier, user-facing messages. */
function normalizeFreighterError(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes('not connected') || msg.includes('user declined') || msg.includes('rejected')) {
    return 'Connection request was declined. Click "Connect" and approve it in the Freighter popup.';
  }
  return raw;
}

/** Returns true if the Freighter extension is installed in this browser. */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return Boolean(result?.isConnected);
  } catch {
    return false;
  }
}

/**
 * Ask Freighter for access and return the connected public key.
 *
 * `requestAccess()` opens Freighter's approval popup the first time and simply
 * resolves with the address on subsequent calls, so it is safe to call every
 * time — this is what reliably clears the "site is not connected to Freighter"
 * state. Throws a friendly error if the user rejects the request.
 */
export async function connectWallet(): Promise<string> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error('Freighter is not installed. Please install the extension.');
  }

  const access = await requestAccess();
  if (access.error) {
    throw new Error(normalizeFreighterError(access.error));
  }
  if (!access.address) {
    throw new Error('Freighter did not return an address. Please try again.');
  }
  return access.address;
}

/**
 * Return the currently authorised address without prompting, or an empty
 * string if the wallet is not connected / not yet authorised.
 */
export async function getConnectedAddress(): Promise<string> {
  try {
    const allowed = await isAllowed();
    if (!allowed?.isAllowed) return '';
    const address = await getAddress();
    return address.error ? '' : address.address;
  } catch {
    return '';
  }
}

/**
 * Verify the wallet is pointed at the Testnet. Returns a warning string when
 * the network does not match, otherwise `null`.
 */
export async function checkNetwork(): Promise<string | null> {
  try {
    const details = await getNetworkDetails();
    if (
      details.networkPassphrase &&
      details.networkPassphrase !== STELLAR_CONFIG.networkPassphrase
    ) {
      return `Freighter is on "${details.network}". Please switch to Testnet.`;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sign a base64-encoded transaction XDR with Freighter, returning the signed
 * XDR ready for submission to Horizon.
 */
export async function signWithFreighter(
  xdr: string,
  address: string
): Promise<string> {
  // Guard: the transaction was built for the Testnet, so Freighter must be on
  // the Testnet too — signing with another network's passphrase yields
  // `tx_bad_auth` at submission time.
  const network = await checkNetwork();
  if (network) {
    throw new Error(network);
  }

  const result = await signTransaction(xdr, {
    address,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  });
  if (result.error) {
    throw new Error(normalizeFreighterError(result.error));
  }

  // Guard: if the user switched the active account in Freighter, it may sign
  // with a different key than the one that built the transaction. That
  // mismatch is the classic cause of `tx_bad_auth`.
  if (result.signerAddress && result.signerAddress !== address) {
    throw new Error(
      'The account selected in Freighter does not match the connected wallet. ' +
        'Switch Freighter back to the connected account (or reconnect) and try again.'
    );
  }

  return result.signedTxXdr;
}

/**
 * Watch Freighter for account / network changes and invoke `onChange` whenever
 * the active address changes. Freighter polls in the background, so this keeps
 * the app's connected address in sync when the user switches accounts in the
 * extension — preventing build/sign mismatches (`tx_bad_auth`).
 *
 * Returns a cleanup function that stops the watcher.
 */
export function watchWalletChanges(
  onChange: (address: string) => void
): () => void {
  const watcher = new WatchWalletChanges(2000);
  watcher.watch(({ address, error }) => {
    if (error) return;
    onChange(address ?? '');
  });
  return () => watcher.stop();
}
