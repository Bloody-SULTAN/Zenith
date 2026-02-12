import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/5 bg-[#0a1628]/60 p-6 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
