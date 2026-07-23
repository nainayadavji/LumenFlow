/**
 * Reusable labelled text input with optional error message.
 */
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
}

export function Input({ label, error, hint, suffix, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={[
            'w-full rounded-xl border bg-slate-900/60 px-4 py-3 text-slate-100',
            'placeholder:text-slate-500 transition-colors',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-rose-500/60 focus:ring-rose-500/40'
              : 'border-slate-700 focus:border-brand-500 focus:ring-brand-500/40',
            suffix ? 'pr-16' : '',
            className,
          ].join(' ')}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
            {suffix}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
