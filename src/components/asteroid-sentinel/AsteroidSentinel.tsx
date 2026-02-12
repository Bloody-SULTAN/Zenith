// ──────────────────────────────────────────────
// Asteroid Sentinel — Placeholder (Architecture Phase)
// ──────────────────────────────────────────────
// Will render charts + data table for Near Earth Objects.
// The useAsteroids hook is ready; Recharts visuals are Phase 2.

import { ShieldAlert, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAsteroids } from '@/hooks/useAsteroids';

export function AsteroidSentinel() {
  const { asteroids, hazardous, totalCount, loading, error, dateRange } =
    useAsteroids();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-6 w-6 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Asteroid Sentinel</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-sm text-slate-400">Total NEOs</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {loading ? '...' : totalCount}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Hazardous</p>
          <p className="mt-1 text-3xl font-bold text-red-400">
            {loading ? '...' : hazardous.length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-slate-400">Date Range</p>
          <p className="mt-1 text-sm font-medium text-sky-400">
            {dateRange.start} to {dateRange.end}
          </p>
        </GlassCard>
      </div>

      <GlassCard>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-400">
            Error: {error.message}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-400">
              Recharts Visualization — Phase 2
            </p>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {asteroids.slice(0, 10).map((neo) => (
                <div
                  key={neo.id}
                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2"
                >
                  <span className="text-sm text-white">{neo.name}</span>
                  <StatusBadge
                    variant={
                      neo.is_potentially_hazardous_asteroid ? 'danger' : 'safe'
                    }
                  >
                    {neo.is_potentially_hazardous_asteroid
                      ? 'Hazardous'
                      : 'Safe'}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
