// ──────────────────────────────────────────────
// ISS Tracking Service — Where The ISS At API
// ──────────────────────────────────────────────
// Uses https://api.wheretheiss.at (HTTPS) instead
// of Open Notify (HTTP-only) to avoid mixed-content
// blocks on HTTPS-hosted sites like GitHub Pages.

import type { ISSPosition, APIError } from '@/types';

const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

interface WhereTheISSResponse {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
}

function buildISSError(status: number, message: string): APIError {
  return {
    status,
    message,
    endpoint: ISS_API_URL,
    timestamp: Date.now(),
    isRateLimited: status === 429,
  };
}

/**
 * Fetch current ISS position.
 * Returns normalized { latitude, longitude, timestamp }.
 */
export async function fetchISSPosition(
  signal?: AbortSignal
): Promise<ISSPosition> {
  let response: Response;
  try {
    response = await fetch(ISS_API_URL, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw buildISSError(0, `Network error: ${String(err)}`);
  }

  if (!response.ok) {
    throw buildISSError(response.status, response.statusText);
  }

  const data: WhereTheISSResponse = await response.json();

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: data.timestamp,
  };
}
