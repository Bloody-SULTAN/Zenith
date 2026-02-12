// ──────────────────────────────────────────────
// useMarsPhotos — Mars Rover Photos hook
// ──────────────────────────────────────────────
// Fetches photos based on rover, sol/date, and camera
// filters. Cancels stale requests when filters change.

import { useState, useEffect } from 'react';
import { fetchMarsPhotos } from '@/services/nasa.service';
import { useZenith } from '@/context/ZenithContext';
import type { MarsPhoto, APIError, RoverName } from '@/types';

interface MarsFilters {
  rover: RoverName;
  sol?: string;
  earthDate?: string;
  camera?: string;
  page?: string;
}

interface UseMarsPhotosResult {
  photos: MarsPhoto[];
  loading: boolean;
  error: APIError | null;
  filters: MarsFilters;
  setFilters: (f: Partial<MarsFilters>) => void;
}

const DEFAULT_FILTERS: MarsFilters = {
  rover: 'curiosity',
  sol: '1000',
};

export function useMarsPhotos(): UseMarsPhotosResult {
  const { apiKey } = useZenith();
  const [filters, setFiltersState] = useState<MarsFilters>(DEFAULT_FILTERS);
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const setFilters = (partial: Partial<MarsFilters>) =>
    setFiltersState((prev) => ({ ...prev, ...partial }));

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {};
    if (filters.sol) params.sol = filters.sol;
    if (filters.earthDate) params.earth_date = filters.earthDate;
    if (filters.camera) params.camera = filters.camera;
    if (filters.page) params.page = filters.page;

    fetchMarsPhotos(apiKey, filters.rover, params, {
      signal: controller.signal,
    })
      .then((res) => setPhotos(res.photos))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as APIError);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiKey, filters]);

  return { photos, loading, error, filters, setFilters };
}
