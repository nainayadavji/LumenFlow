/**
 * Toast presentation layer. State/logic lives in `ToastContext`.
 */
import type { Toast } from '@/types';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const STYLES: Record<Toast['variant'], string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
  info: 'border-brand-500/40 bg-brand-500/10 text-brand-200',
};

const ICONS: Record<Toast['variant'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={[
            'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border',
            'px-4 py-3 shadow-lg backdrop-blur-md animate-slide-in',
            STYLES[toast.variant],
          ].join(' ')}
        >
          <span className="mt-0.5 font-bold">{ICONS[toast.variant]}</span>
          <p className="flex-1 text-sm leading-snug">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="text-lg leading-none opacity-60 transition hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
