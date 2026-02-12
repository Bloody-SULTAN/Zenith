// ──────────────────────────────────────────────
// Global State — React Context + useReducer
// ──────────────────────────────────────────────
// Strategy: Lightweight Context for truly global
// concerns (API key, user location, active module).
// Per-module data lives in custom hooks with their
// own local state — this avoids unnecessary rerenders
// when only one module's data changes.

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { ModuleName } from '@/types';

// ── State shape ──────────────────────────────
interface State {
  apiKey: string;
  userLocation: { lat: number; lng: number } | null;
  activeModule: ModuleName;
}

const initialState: State = {
  apiKey: import.meta.env.VITE_NASA_API_KEY ?? '',
  userLocation: null,
  activeModule: 'dashboard',
};

// ── Actions ──────────────────────────────────
type Action =
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_USER_LOCATION'; payload: { lat: number; lng: number } | null }
  | { type: 'SET_ACTIVE_MODULE'; payload: ModuleName };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload };
    case 'SET_ACTIVE_MODULE':
      return { ...state, activeModule: action.payload };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────
interface ZenithContextValue extends State {
  setApiKey: (key: string) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setActiveModule: (module: ModuleName) => void;
}

const ZenithContext = createContext<ZenithContextValue | null>(null);

// ── Provider ─────────────────────────────────
export function ZenithProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setApiKey = useCallback(
    (key: string) => dispatch({ type: 'SET_API_KEY', payload: key }),
    []
  );
  const setUserLocation = useCallback(
    (loc: { lat: number; lng: number } | null) =>
      dispatch({ type: 'SET_USER_LOCATION', payload: loc }),
    []
  );
  const setActiveModule = useCallback(
    (module: ModuleName) =>
      dispatch({ type: 'SET_ACTIVE_MODULE', payload: module }),
    []
  );

  return (
    <ZenithContext.Provider
      value={{ ...state, setApiKey, setUserLocation, setActiveModule }}
    >
      {children}
    </ZenithContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────
export function useZenith(): ZenithContextValue {
  const ctx = useContext(ZenithContext);
  if (!ctx) {
    throw new Error('useZenith must be used within <ZenithProvider>');
  }
  return ctx;
}
