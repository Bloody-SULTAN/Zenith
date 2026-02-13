// ──────────────────────────────────────────────
// useISSPosition — Client-side SGP4 ISS tracking
// ──────────────────────────────────────────────
// Fetches TLE data once from CelesTrak (cached 7 days),
// then propagates the ISS position client-side every
// second using satellite.js. Zero API polling.

import { useState, useEffect, useCallback } from 'react';
import { fetchTLE, propagateISS, clearTLECache } from '@/services/tle.service';
import type { ISSPositionExtended, TLEData } from '@/types';

const MAX_HISTORY = 100;
const PROPAGATION_INTERVAL = 1000; // 1 second

interface UseISSPositionResult {
  position: ISSPositionExtended | null;
  history: ISSPositionExtended[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useISSPosition(): UseISSPositionResult {
  const [tle, setTle] = useState<TLEData | null>(null);
  const [position, setPosition] = useState<ISSPositionExtended | null>(null);
  const [history, setHistory] = useState<ISSPositionExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    clearTLECache();
    setTle(null);
    setLoading(true);
    setError(null);
    setTrigger((n) => n + 1);
  }, []);

  // Effect 1: Fetch TLE data once
  useEffect(() => {
    const controller = new AbortController();
    fetchTLE(controller.signal)
      .then((data) => {
        setTle(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(`TLE fetch failed: ${String(err)}`);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [trigger]);

  // Effect 2: Propagate position every second once TLE is available
  useEffect(() => {
    if (!tle) return;

    function tick() {
      try {
        const pos = propagateISS(tle!);
        setPosition(pos);
        setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), pos]);
        setError(null);
      } catch (err: unknown) {
        setError(`Propagation error: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    tick(); // Run immediately
    const id = setInterval(tick, PROPAGATION_INTERVAL);
    return () => clearInterval(id);
  }, [tle]);

  return { position, history, loading, error, refetch };
}
