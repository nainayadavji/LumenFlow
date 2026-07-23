/**
 * useCopy — copy a string to the clipboard and expose a short-lived "copied"
 * flag for UI feedback (e.g. swapping an icon to a checkmark).
 */
import { useCallback, useRef, useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';

export function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      const ok = await copyToClipboard(text);
      if (ok) {
        setCopied(true);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetMs);
      }
      return ok;
    },
    [resetMs]
  );

  return { copied, copy };
}
