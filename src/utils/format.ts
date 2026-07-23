/**
 * Small formatting / helper utilities shared across the UI.
 */

/** Truncate a Stellar public key for compact display: `GABC…WXYZ`. */
export function truncateAddress(address: string, visible = 4): string {
  if (!address) return '';
  if (address.length <= visible * 2 + 1) return address;
  return `${address.slice(0, visible)}…${address.slice(-visible)}`;
}

/**
 * Format a raw XLM balance string into a friendly number with thousands
 * separators and up to 7 decimal places (Stellar's native precision).
 */
export function formatXlm(amount: string | number): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(value);
}

/** Basic client-side validation for a Stellar public key. */
export function isValidPublicKey(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address.trim());
}

/** Basic validation for a positive numeric payment amount. */
export function isValidAmount(amount: string): boolean {
  const value = Number(amount);
  return Number.isFinite(value) && value > 0;
}
