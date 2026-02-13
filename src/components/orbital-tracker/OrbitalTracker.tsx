// ──────────────────────────────────────────────
// Orbital Tracker — Real-time ISS Map
// ──────────────────────────────────────────────
// Renders an interactive Leaflet map with the ISS
// position propagated client-side via SGP4.

import { Orbit, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useISSPosition } from '@/hooks/useISSPosition';
import { ISSMap } from './ISSMap';

export function OrbitalTracker() {
  const { position, history, loading, error } = useISSPosition();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Orbit className="h-6 w-6 text-sky-400" />
        <h1 className="text-2xl font-bold text-white">Orbital Tracker</h1>
      </div>

      <GlassCard className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-[500px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : error ? (
          <div className="flex h-[500px] items-center justify-center text-red-400">
            Error: {error}
          </div>
        ) : position ? (
          <ISSMap position={position} history={history} />
        ) : null}
      </GlassCard>
    </div>
  );
}
