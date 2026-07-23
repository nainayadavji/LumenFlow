/**
 * Stellar / Horizon operations: reading balances and building + submitting
 * payment transactions on the Testnet.
 */
import {
  Horizon,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '@/config/stellar';
import { signWithFreighter, getConnectedAddress } from '@/services/freighter';
import type { AccountBalance, TransactionResult } from '@/types';

/** Shared Horizon server instance (Testnet). */
export const server = new Horizon.Server(STELLAR_CONFIG.horizonUrl);

/**
 * Fetch the native XLM balance for an account.
 *
 * Throws a descriptive error when the account is not found — on Testnet this
 * usually means it has not yet been funded via Friendbot.
 */
export async function fetchBalance(address: string): Promise<AccountBalance> {
  try {
    const account = await server.loadAccount(address);
    const native = account.balances.find((b) => b.asset_type === 'native');
    return {
      xlm: native?.balance ?? '0',
      subentryCount: account.subentry_count,
    };
  } catch (err: unknown) {
    if (isNotFound(err)) {
      throw new Error(
        'Account not found on Testnet. Fund it with Friendbot first.'
      );
    }
    throw new Error('Failed to load balance from Horizon.');
  }
}

/**
 * Build, sign (via Freighter) and submit a native XLM payment.
 *
 * @param source      Sender public key (the connected wallet).
 * @param destination Receiver public key.
 * @param amount      Amount of XLM to send, as a string.
 * @param memo        Optional text memo.
 */
export async function sendPayment(
  source: string,
  destination: string,
  amount: string,
  memo?: string
): Promise<TransactionResult> {
  // Freighter's active account may have changed since the app connected.
  // Re-read the live address so the account that BUILDS the transaction is the
  // same one that SIGNS it — otherwise submission fails with `tx_bad_auth`.
  const activeAddress = await getConnectedAddress();
  const from = activeAddress || source;
  if (activeAddress && activeAddress !== source) {
    throw new Error(
      'Freighter is now on a different account than the one connected in the app. ' +
        'Reconnect your wallet (Disconnect → Connect) to sync, then try again.'
    );
  }

  // Load the source account to get the current sequence number.
  const account = await server.loadAccount(from);

  const builder = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(180);

  if (memo && memo.trim().length > 0) {
    builder.addMemo(Memo.text(memo.trim()));
  }

  const tx = builder.build();

  // Freighter signs the XDR; we then rebuild it and submit to Horizon.
  const signedXdr = await signWithFreighter(tx.toXDR(), from);
  const signedTx = TransactionBuilder.fromXDR(
    signedXdr,
    STELLAR_CONFIG.networkPassphrase
  );

  const response = await server.submitTransaction(signedTx);

  return {
    hash: response.hash,
    successful: response.successful,
  };
}

/**
 * Fund an account on the Testnet using Friendbot.
 *
 * Friendbot creates and funds a brand-new account with test XLM. This only
 * works on the Testnet and only for accounts that do not already exist.
 */
export async function fundWithFriendbot(address: string): Promise<void> {
  const url = `${STELLAR_CONFIG.friendbotUrl}?addr=${encodeURIComponent(address)}`;
  const response = await fetch(url);

  if (!response.ok) {
    // Friendbot returns 400 with a detail message when the account already
    // exists or the request is otherwise invalid.
    let detail = '';
    try {
      const body = (await response.json()) as { detail?: string };
      detail = body.detail ?? '';
    } catch {
      /* ignore non-JSON bodies */
    }
    if (detail.toLowerCase().includes('createaccountalreadyexist')) {
      throw new Error('This account is already funded.');
    }
    throw new Error(detail || 'Friendbot funding failed. Please try again.');
  }
}

/** Narrow an unknown Horizon error to a 404 (account not found). */
function isNotFound(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    (err as { response?: { status?: number } }).response?.status === 404
  );
}

/**
 * Parse a Horizon submission error into a human-readable message by inspecting
 * the `result_codes` returned in the extras payload.
 */
export function parseHorizonError(err: unknown): string {
  const extras = (
    err as { response?: { data?: { extras?: { result_codes?: Record<string, unknown> } } } }
  )?.response?.data?.extras;

  const codes = extras?.result_codes;
  if (codes) {
    const operationCodes = (codes.operations as string[] | undefined)?.join(', ');
    if (operationCodes?.includes('op_underfunded')) {
      return 'Insufficient balance to complete this payment.';
    }
    if (operationCodes?.includes('op_no_destination')) {
      return 'Destination account does not exist on Testnet.';
    }
    if (codes.transaction === 'tx_bad_seq') {
      return 'Bad sequence number. Please try again.';
    }
    if (codes.transaction === 'tx_bad_auth' || codes.transaction === 'tx_bad_auth_extra') {
      return 'Signature mismatch (tx_bad_auth). Make sure Freighter is on Testnet and the active account matches your connected wallet, then try again.';
    }
    return `Transaction failed: ${operationCodes ?? String(codes.transaction)}`;
  }

  if (err instanceof Error) return err.message;
  return 'Transaction failed. Please try again.';
}
