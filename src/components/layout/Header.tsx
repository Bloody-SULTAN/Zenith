import { Bell, Search, Key } from 'lucide-react';
import { useZenith } from '@/context/ZenithContext';

export function Header() {
  const { apiKey } = useZenith();
  const hasKey = apiKey.length > 0 && apiKey !== 'DEMO_KEY';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#020617]/80 px-6 backdrop-blur-xl">
      {/* Search stub */}
      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-400">
        <Search className="h-4 w-4" />
        <span>Search modules...</span>
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-4">
        {/* API Key status */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            hasKey
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-amber-400/10 text-amber-400'
          }`}
        >
          <Key className="h-3 w-3" />
          {hasKey ? 'API Connected' : 'Using DEMO_KEY'}
        </div>

        {/* Notifications stub */}
        <button className="relative rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
