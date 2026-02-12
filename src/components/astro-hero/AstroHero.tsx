import { Loader2, RefreshCw } from 'lucide-react';
import { useAPOD } from '@/hooks/useAPOD';

export function AstroHero() {
  const { data, loading, error, refetch } = useAPOD();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-[#0a1628]/60">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/5">
        <p className="text-sm text-red-400">Failed to load Astronomy Picture of the Day</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5">
      {data.media_type === 'image' ? (
        <img
          src={data.url}
          alt={data.title}
          className="h-64 w-full object-cover"
        />
      ) : (
        <iframe
          src={data.url}
          title={data.title}
          className="h-64 w-full"
          allowFullScreen
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-sky-400">
          Astronomy Picture of the Day
        </p>
        <h2 className="text-xl font-bold text-white">{data.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">
          {data.explanation}
        </p>
      </div>
    </div>
  );
}
