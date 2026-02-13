// ──────────────────────────────────────────────
// TLE Service — SGP4 Client-Side Propagation
// ──────────────────────────────────────────────
// Fetches TLE from CelesTrak once, caches in localStorage.
// Propagates ISS position client-side using satellite.js —
// zero API polling, zero rate limits.

import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  degreesLong,
  degreesLat,
} from 'satellite.js';
import type { ISSPositionExtended, TLEData } from '@/types';

const CELESTRAK_URL =
  'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE';
const CACHE_KEY = 'zenith_iss_tle';
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Recent fallback TLE in case CelesTrak is unreachable.
// Good enough for a plausible orbit; will drift over months.
const FALLBACK_TLE: TLEData = {
  line1: '1 25544U 98067A   25040.50000000  .00016717  00000-0  10270-3 0  9002',
  line2: '2 25544  51.6400  10.0000 0001234  20.0000 340.0000 15.49000000400000',
  fetchedAt: 0,
};

function getCachedTLE(): TLEData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const tle: TLEData = JSON.parse(raw);
    if (Date.now() - tle.fetchedAt > CACHE_MAX_AGE_MS) return null;
    return tle;
  } catch {
    return null;
  }
}

/**
 * Fetch TLE data for the ISS (NORAD 25544).
 * Checks localStorage cache first, then CelesTrak, then falls back
 * to a hardcoded recent TLE.
 */
export async function fetchTLE(signal?: AbortSignal): Promise<TLEData> {
  const cached = getCachedTLE();
  if (cached) return cached;

  try {
    const response = await fetch(CELESTRAK_URL, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const lines = text.trim().split('\n').map((l) => l.trim());

    // CelesTrak returns: name (line 0), TLE line 1, TLE line 2
    const line1 = lines.find((l) => l.startsWith('1 '));
    const line2 = lines.find((l) => l.startsWith('2 '));

    if (!line1 || !line2) throw new Error('Invalid TLE format');

    const tle: TLEData = { line1, line2, fetchedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(tle));
    return tle;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    console.warn('[Zenith] CelesTrak fetch failed, using fallback TLE:', err);
    return FALLBACK_TLE;
  }
}

/**
 * Propagate ISS position at a given time using SGP4.
 * Returns lat, lon, altitude, velocity — all computed client-side.
 */
export function propagateISS(
  tle: TLEData,
  date: Date = new Date()
): ISSPositionExtended {
  const satrec = twoline2satrec(tle.line1, tle.line2);
  const result = propagate(satrec, date);

  if (!result || !result.position || typeof result.position === 'boolean') {
    throw new Error('SGP4 propagation failed — TLE may be stale');
  }

  const gmst = gstime(date);
  const geo = eciToGeodetic(result.position, gmst);

  const velocity = typeof result.velocity === 'boolean'
    ? 0
    : Math.sqrt(
        result.velocity.x ** 2 +
        result.velocity.y ** 2 +
        result.velocity.z ** 2
      );

  return {
    latitude: degreesLat(geo.latitude),
    longitude: degreesLong(geo.longitude),
    altitude: geo.height,
    velocity,
    timestamp: Math.floor(date.getTime() / 1000),
  };
}

/**
 * Clear cached TLE (used by refetch).
 */
export function clearTLECache(): void {
  localStorage.removeItem(CACHE_KEY);
}
