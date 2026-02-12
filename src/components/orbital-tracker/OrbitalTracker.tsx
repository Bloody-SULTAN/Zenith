// ──────────────────────────────────────────────
// Orbital Tracker — Placeholder (Architecture Phase)
// ──────────────────────────────────────────────
// Will render a Leaflet map with real-time ISS position.
// The useISSPosition hook is ready; map rendering is Phase 2.

import { Orbit, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useISSPosition } from '@/hooks/useISSPosition';

export function OrbitalTracker() {
  const { position, loading, error } = useISSPosition();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Orbit className="h-6 w-6 text-sky-400" />
        <h1 className="text-2xl font-bold text-white">Orbital Tracker</h1>
      </div>

      <GlassCard>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center text-red-400">
            Error: {error.message}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-400">
            <Orbit className="h-16 w-16 text-sky-400/30" />
            <div className="text-center">
              <p className="text-lg font-medium text-white">
                Leaflet Map — Phase 2
              </p>
              {position && (
                <p className="mt-2 font-mono text-sm text-sky-400">
                  ISS Position: {position.latitude.toFixed(4)},{' '}
                  {position.longitude.toFixed(4)}
                </p>
              )}
              <p className="mt-1 text-sm">
                Real-time ISS tracking with orbital path visualization
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
