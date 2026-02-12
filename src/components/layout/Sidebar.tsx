import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Orbit,
  Image,
  ShieldAlert,
  Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orbital-tracker', label: 'Orbital Tracker', icon: Orbit },
  { to: '/martian-archive', label: 'Martian Archive', icon: Image },
  { to: '/asteroid-sentinel', label: 'Asteroid Sentinel', icon: ShieldAlert },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/5 bg-[#0a1628]/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <Orbit className="h-7 w-7 text-sky-400" />
        <span className="text-lg font-bold tracking-wide text-white">
          ZENITH
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-400/10 text-sky-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-xs text-slate-500">
          Project Zenith v0.1.0
        </p>
      </div>
    </aside>
  );
}
