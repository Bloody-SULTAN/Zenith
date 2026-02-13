// ──────────────────────────────────────────────
// useMarsPhotos — Mars Rover Photos hook
// ──────────────────────────────────────────────
// On initial load, fetches "latest_photos" (no sol needed —
// always returns data). When the user applies filters (sol,
// date, camera), switches to the sol/date-based endpoint.
// Cancels stale requests when filters change.

import { useState, useEffect } from 'react';
import {
  fetchMarsPhotos,
  fetchLatestMarsPhotos,
} from '@/services/nasa.service';
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

    const hasSpecificQuery =
      filters.sol || filters.earthDate || filters.camera;

    const request = hasSpecificQuery
      ? // User applied filters — use sol/date endpoint
        (() => {
          const params: Record<string, string> = { page: filters.page || '1' };
          if (filters.sol) params.sol = filters.sol;
          if (filters.earthDate) params.earth_date = filters.earthDate;
          if (filters.camera) params.camera = filters.camera;
          return fetchMarsPhotos(apiKey, filters.rover, params, {
            signal: controller.signal,
          }).then((res) => res.photos);
        })()
      : // Default — fetch latest photos (always has data)
        fetchLatestMarsPhotos(apiKey, filters.rover, {
          signal: controller.signal,
        }).then((res) => res.latest_photos);

    request
      .then(setPhotos)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as APIError);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiKey, filters]);

  return { photos, loading, error, filters, setFilters };
}
