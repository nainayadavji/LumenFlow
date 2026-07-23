/**
 * Small reusable "copy to clipboard" icon button with success feedback.
 */
import { useCopy } from '@/hooks/useCopy';
import { useToast } from '@/context/ToastContext';

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = 'Copied', className = '' }: CopyButtonProps) {
  const { copied, copy } = useCopy();
  const { notify } = useToast();

  const handleClick = async () => {
    const ok = await copy(value);
    notify(ok ? `${label} to clipboard` : 'Failed to copy', ok ? 'success' : 'error');
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Copy ${label.toLowerCase()}`}
      title="Copy to clipboard"
      className={[
        'inline-grid h-8 w-8 place-items-center rounded-lg border border-slate-600',
        'bg-slate-700/50 text-slate-300 transition-all hover:bg-slate-600 active:scale-90',
        className,
      ].join(' ')}
    >
      {copied ? (
        <span className="text-emerald-400">✓</span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
