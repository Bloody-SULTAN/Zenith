// ──────────────────────────────────────────────
// useISSPosition — Real-time ISS tracking hook
// ──────────────────────────────────────────────
// Polls every `intervalMs` (default 5s). Maintains
// a position history for trail rendering on the map.
// Auto-cleans up interval + AbortController on unmount.

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchISSPosition } from '@/services/iss.service';
import type { ISSPosition, APIError } from '@/types';

const MAX_HISTORY = 100;
const DEFAULT_INTERVAL = 5000;

interface UseISSPositionResult {
  position: ISSPosition | null;
  history: ISSPosition[];
  loading: boolean;
  error: APIError | null;
  refetch: () => void;
}

export function useISSPosition(
  intervalMs = DEFAULT_INTERVAL
): UseISSPositionResult {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [history, setHistory] = useState<ISSPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchPosition = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const pos = await fetchISSPosition(controller.signal);
      setPosition(pos);
      setHistory((prev) => [...prev.slice(-(MAX_HISTORY - 1)), pos]);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err as APIError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosition();
    const id = setInterval(fetchPosition, intervalMs);
    return () => {
      clearInterval(id);
      controllerRef.current?.abort();
    };
  }, [fetchPosition, intervalMs]);

  return { position, history, loading, error, refetch: fetchPosition };
}
