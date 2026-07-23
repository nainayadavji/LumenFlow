/**
 * Loading indicators: a simple spinner and a shimmering skeleton block.
 */

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = 'h-5 w-5' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full border-2',
        'border-brand-400/30 border-t-brand-400',
        className,
      ].join(' ')}
    />
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-8 w-40' }: SkeletonProps) {
  return (
    <div
      className={[
        'rounded-lg bg-slate-700/50',
        'bg-gradient-to-r from-slate-700/40 via-slate-600/60 to-slate-700/40',
        'bg-[length:1000px_100%] animate-shimmer',
        className,
      ].join(' ')}
    />
  );
}
