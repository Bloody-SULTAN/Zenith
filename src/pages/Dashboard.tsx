import { Orbit, Image, ShieldAlert, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AstroHero } from '@/components/astro-hero/AstroHero';
import { GlassCard } from '@/components/ui/GlassCard';

const MODULE_CARDS = [
  {
    to: '/orbital-tracker',
    icon: Orbit,
    title: 'Orbital Tracker',
    description: 'Real-time ISS position tracking on an interactive map',
    color: 'text-sky-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]',
  },
  {
    to: '/martian-archive',
    icon: Image,
    title: 'Martian Archive',
    description: 'Browse Mars Rover photos with rover and camera filters',
    color: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]',
  },
  {
    to: '/asteroid-sentinel',
    icon: ShieldAlert,
    title: 'Asteroid Sentinel',
    description: 'Monitor Near Earth Objects and their hazard classifications',
    color: 'text-red-400',
    glow: 'group-hover:shadow-[0_0_30px_rgba(248,113,113,0.1)]',
  },
] as const;

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* APOD Hero */}
      <AstroHero />

      {/* System status bar */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Activity className="h-4 w-4" />
        <span>All systems operational</span>
        <span className="ml-auto font-mono text-xs text-slate-600">
          {new Date().toISOString().split('T')[0]}
        </span>
      </div>

      {/* Module cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {MODULE_CARDS.map(({ to, icon: Icon, title, description, color, glow }) => (
          <Link key={to} to={to} className="group">
            <GlassCard className={`transition-all hover:border-white/10 ${glow}`}>
              <Icon className={`h-8 w-8 ${color}`} />
              <h3 className="mt-4 text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
