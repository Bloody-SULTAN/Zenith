// ──────────────────────────────────────────────
// Martian Archive — Placeholder (Architecture Phase)
// ──────────────────────────────────────────────
// Will render a searchable photo gallery with rover/camera filters.
// The useMarsPhotos hook is ready; gallery UI is Phase 2.

import { Image, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMarsPhotos } from '@/hooks/useMarsPhotos';

export function MartianArchive() {
  const { photos, loading, error, filters } = useMarsPhotos();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Image className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">Martian Archive</h1>
      </div>

      <GlassCard>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center text-red-400">
            Error: {error.message}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-400">
            <Image className="h-16 w-16 text-amber-400/30" />
            <div className="text-center">
              <p className="text-lg font-medium text-white">
                Photo Gallery — Phase 2
              </p>
              <p className="mt-2 font-mono text-sm text-amber-400">
                Rover: {filters.rover}
                {filters.sol ? ` | Sol: ${filters.sol}` : ' | Latest'} |{' '}
                {photos.length} photos loaded
              </p>
              <p className="mt-1 text-sm">
                Searchable gallery with rover and camera filters
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
