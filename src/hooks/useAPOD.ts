// ──────────────────────────────────────────────
// useAPOD — Astronomy Picture of the Day hook
// ──────────────────────────────────────────────
// Fetches APOD on mount. Cancels in-flight requests
// on unmount via AbortController.

import { useState, useEffect } from 'react';
import { fetchAPOD } from '@/services/nasa.service';
import { useZenith } from '@/context/ZenithContext';
import type { APODResponse, APIError } from '@/types';

interface UseAPODResult {
  data: APODResponse | null;
  loading: boolean;
  error: APIError | null;
  refetch: () => void;
}

export function useAPOD(): UseAPODResult {
  const { apiKey } = useZenith();
  const [data, setData] = useState<APODResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchAPOD(apiKey, { signal: controller.signal })
      .then(setData)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as APIError);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiKey, trigger]);

  return { data, loading, error, refetch: () => setTrigger((t) => t + 1) };
}
