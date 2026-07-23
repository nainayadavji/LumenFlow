/**
 * Shared application types.
 */

/** A parsed XLM balance for the connected account. */
export interface AccountBalance {
  /** Native XLM balance as a human-readable string, e.g. "9999.9999900". */
  xlm: string;
  /** Total number of subentries (reserved balance indicator). */
  subentryCount: number;
}

/** Result of a submitted payment transaction. */
export interface TransactionResult {
  hash: string;
  successful: boolean;
}

/** Status of an async data/action flow used across the UI. */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/** Toast notification variants. */
export type ToastVariant = 'success' | 'error' | 'info';

/** A single toast notification. */
export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}
