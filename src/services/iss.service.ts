// ──────────────────────────────────────────────
// ISS Tracking Service — Open Notify API
// ──────────────────────────────────────────────
// Separate from nasa.service because Open Notify
// is a different API (no API key required).

import type { ISSPosition, ISSAPIResponse, APIError } from '@/types';

const ISS_API_URL = 'http://api.open-notify.org/iss-now.json';

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

  const data: ISSAPIResponse = await response.json();

  return {
    latitude: parseFloat(data.iss_position.latitude),
    longitude: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp,
  };
}
