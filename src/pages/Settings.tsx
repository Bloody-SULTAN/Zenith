import { useState } from 'react';
import { Key, Save, ExternalLink } from 'lucide-react';
import { useZenith } from '@/context/ZenithContext';
import { GlassCard } from '@/components/ui/GlassCard';

export function Settings() {
  const { apiKey, setApiKey } = useZenith();
  const [draft, setDraft] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <GlassCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">NASA API Key</h2>
          </div>

          <p className="text-sm text-slate-400">
            Get a free API key from{' '}
            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sky-400 hover:underline"
            >
              api.nasa.gov <ExternalLink className="h-3 w-3" />
            </a>
            . The DEMO_KEY works but has lower rate limits (30 req/hr vs 1000
            req/hr).
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Enter your NASA API key..."
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/25"
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-sky-400/10 px-4 py-2.5 text-sm font-medium text-sky-400 transition hover:bg-sky-400/20"
            >
              <Save className="h-4 w-4" />
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>

          {/* Env var hint */}
          <p className="text-xs text-slate-500">
            You can also set <code className="text-sky-400/70">VITE_NASA_API_KEY</code>{' '}
            in a <code className="text-sky-400/70">.env</code> file to persist across sessions.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
