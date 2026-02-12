// ──────────────────────────────────────────────
// Project Zenith — Space/Futuristic Theme Config
// ──────────────────────────────────────────────
// This file exports semantic design tokens consumed
// by components. Tailwind classes reference these
// via the custom theme extension in index.css.

export const ZENITH_COLORS = {
  // Primary palette
  navy: {
    900: '#020617', // Deep space background
    800: '#0a1628', // Card / panel background
    700: '#111d35', // Elevated surface
    600: '#1a2744', // Hover states
  },
  electric: {
    500: '#38bdf8', // Primary accent (Electric Blue)
    400: '#7dd3fc', // Lighter accent
    300: '#bae6fd', // Subtle highlight
    glow: 'rgba(56, 189, 248, 0.15)', // Glow effect
  },
  amber: {
    500: '#fbbf24', // Warning / hazard
    400: '#fcd34d', // Lighter warning
    glow: 'rgba(251, 191, 36, 0.15)', // Warning glow
  },
  status: {
    safe: '#34d399',    // Emerald — non-hazardous
    danger: '#f87171',  // Red — hazardous asteroid
    info: '#38bdf8',    // Electric blue — informational
    muted: '#64748b',   // Slate — disabled / secondary text
  },
  surface: {
    glass: 'rgba(2, 6, 23, 0.7)',     // Glassmorphism panels
    overlay: 'rgba(2, 6, 23, 0.85)',   // Modal overlay
    divider: 'rgba(56, 189, 248, 0.1)', // Subtle borders
  },
} as const;

export const ZENITH_TYPOGRAPHY = {
  fontFamily: {
    display: '"Inter", "SF Pro Display", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
} as const;

export const ZENITH_EFFECTS = {
  glow: {
    electric: `0 0 20px ${ZENITH_COLORS.electric.glow}, 0 0 60px ${ZENITH_COLORS.electric.glow}`,
    amber: `0 0 20px ${ZENITH_COLORS.amber.glow}, 0 0 60px ${ZENITH_COLORS.amber.glow}`,
  },
  glassBorder: `1px solid ${ZENITH_COLORS.surface.divider}`,
  transition: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Recharts color sequences for consistent chart theming
export const CHART_COLORS = {
  primary: ZENITH_COLORS.electric[500],
  secondary: ZENITH_COLORS.amber[500],
  safe: ZENITH_COLORS.status.safe,
  danger: ZENITH_COLORS.status.danger,
  muted: ZENITH_COLORS.status.muted,
  sequence: [
    '#38bdf8', // Electric blue
    '#fbbf24', // Amber
    '#34d399', // Emerald
    '#f87171', // Red
    '#a78bfa', // Violet
    '#fb923c', // Orange
  ],
} as const;
