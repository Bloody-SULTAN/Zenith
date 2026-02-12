// ──────────────────────────────────────────────
// useAsteroids — Near Earth Objects hook
// ──────────────────────────────────────────────
// Fetches NeoWs feed for a date range (default: today + 7 days).
// Flattens the nested date-keyed response into a sorted array.

import { useState, useEffect, useMemo } from 'react';
import { fetchAsteroids } from '@/services/nasa.service';
import { useZenith } from '@/context/ZenithContext';
import type { NearEarthObject, APIError } from '@/types';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

interface UseAsteroidsResult {
  asteroids: NearEarthObject[];
  hazardous: NearEarthObject[];
  totalCount: number;
  loading: boolean;
  error: APIError | null;
  dateRange: { start: string; end: string };
  setDateRange: (start: string, end: string) => void;
  refetch: () => void;
}

export function useAsteroids(): UseAsteroidsResult {
  const { apiKey } = useZenith();
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(addDays(todayISO(), 7));
  const [allObjects, setAllObjects] = useState<NearEarthObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchAsteroids(apiKey, startDate, endDate, {
      signal: controller.signal,
    })
      .then((res) => {
        // Flatten the date-keyed object into a single sorted array
        const flat = Object.values(res.near_earth_objects).flat();
        flat.sort(
          (a, b) =>
            parseFloat(
              a.close_approach_data[0]?.miss_distance?.kilometers ?? '0'
            ) -
            parseFloat(
              b.close_approach_data[0]?.miss_distance?.kilometers ?? '0'
            )
        );
        setAllObjects(flat);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as APIError);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [apiKey, startDate, endDate, trigger]);

  const hazardous = useMemo(
    () => allObjects.filter((a) => a.is_potentially_hazardous_asteroid),
    [allObjects]
  );

  const setDateRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return {
    asteroids: allObjects,
    hazardous,
    totalCount: allObjects.length,
    loading,
    error,
    dateRange: { start: startDate, end: endDate },
    setDateRange,
    refetch: () => setTrigger((t) => t + 1),
  };
}
