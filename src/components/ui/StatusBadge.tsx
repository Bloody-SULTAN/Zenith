interface StatusBadgeProps {
  variant: 'safe' | 'danger' | 'info' | 'warning';
  children: string;
}

const VARIANTS = {
  safe: 'bg-emerald-400/10 text-emerald-400',
  danger: 'bg-red-400/10 text-red-400',
  info: 'bg-sky-400/10 text-sky-400',
  warning: 'bg-amber-400/10 text-amber-400',
} as const;

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
