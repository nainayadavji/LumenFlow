/**
 * Lightweight, decoupled app events using the browser's EventTarget.
 *
 * Used so that a successful payment can trigger a balance refresh without the
 * transaction and balance components needing to know about each other.
 */

const bus = new EventTarget();

export const APP_EVENTS = {
  balanceRefresh: 'balance:refresh',
} as const;

/** Emit an app event. */
export function emitAppEvent(name: string): void {
  bus.dispatchEvent(new Event(name));
}

/** Subscribe to an app event; returns an unsubscribe function. */
export function onAppEvent(name: string, handler: () => void): () => void {
  bus.addEventListener(name, handler);
  return () => bus.removeEventListener(name, handler);
}
