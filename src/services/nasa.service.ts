// ──────────────────────────────────────────────
// NASA API Service — Project Zenith
// ──────────────────────────────────────────────
// Central fetch utility for all NASA APIs.
// Handles: error normalization, rate-limit detection,
// request logging, and AbortController integration.

import type {
  APODResponse,
  MarsPhotosResponse,
  MarsLatestPhotosResponse,
  NeoWsResponse,
  APIError,
  FetchOptions,
} from '@/types';

const NASA_BASE_URL = 'https://api.nasa.gov';
const DEMO_KEY = 'DEMO_KEY';

// Rate-limit tracking
interface RateLimitState {
  remaining: number | null;
  limit: number | null;
  lastChecked: number;
}

const rateLimits: Record<string, RateLimitState> = {};

function logRateLimit(endpoint: string, headers: Headers): void {
  const remaining = headers.get('X-RateLimit-Remaining');
  const limit = headers.get('X-RateLimit-Limit');

  rateLimits[endpoint] = {
    remaining: remaining ? parseInt(remaining, 10) : null,
    limit: limit ? parseInt(limit, 10) : null,
    lastChecked: Date.now(),
  };

  if (remaining !== null && parseInt(remaining, 10) < 10) {
    console.warn(
      `[Zenith] Rate limit warning for ${endpoint}: ${remaining}/${limit} requests remaining`
    );
  }
}

function buildAPIError(
  status: number,
  message: string,
  endpoint: string
): APIError {
  return {
    status,
    message,
    endpoint,
    timestamp: Date.now(),
    isRateLimited: status === 429,
  };
}

/**
 * Core fetch wrapper for NASA APIs.
 * - Appends API key to every request
 * - Normalizes errors into APIError shape
 * - Logs rate-limit headers
 * - Supports AbortSignal for cancellation
 */
async function nasaFetch<T>(
  endpoint: string,
  apiKey: string,
  options: FetchOptions = {}
): Promise<T> {
  const key = apiKey || DEMO_KEY;
  const url = new URL(endpoint, NASA_BASE_URL);
  url.searchParams.set('api_key', key);

  if (options.params) {
    for (const [k, v] of Object.entries(options.params)) {
      url.searchParams.set(k, v);
    }
  }

  const fetchInit: RequestInit = {};
  if (options.signal) {
    fetchInit.signal = options.signal;
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), fetchInit);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err; // Let callers handle cancellation
    }
    throw buildAPIError(0, `Network error: ${String(err)}`, endpoint);
  }

  logRateLimit(endpoint, response.headers);

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      errorMessage = body?.error?.message || body?.msg || errorMessage;
    } catch {
      // Body wasn't JSON — use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw buildAPIError(response.status, errorMessage, endpoint);
  }

  return response.json() as Promise<T>;
}

// ── Public API Methods ───────────────────────

/**
 * Astronomy Picture of the Day
 * Endpoint: GET /planetary/apod
 */
export function fetchAPOD(
  apiKey: string,
  options?: FetchOptions
): Promise<APODResponse> {
  return nasaFetch<APODResponse>('/planetary/apod', apiKey, options);
}

/**
 * Mars Rover Photos
 * Endpoint: GET /mars-photos/api/v1/rovers/{rover}/photos
 */
export function fetchMarsPhotos(
  apiKey: string,
  rover: string,
  params: { sol?: string; earth_date?: string; camera?: string; page?: string },
  options?: FetchOptions
): Promise<MarsPhotosResponse> {
  const cleanParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') cleanParams[k] = v;
  }

  return nasaFetch<MarsPhotosResponse>(
    `/mars-photos/api/v1/rovers/${rover}/photos`,
    apiKey,
    { ...options, params: cleanParams }
  );
}

/**
 * Mars Rover Latest Photos (no sol required — always returns data)
 * Endpoint: GET /mars-photos/api/v1/rovers/{rover}/latest_photos
 */
export function fetchLatestMarsPhotos(
  apiKey: string,
  rover: string,
  options?: FetchOptions
): Promise<MarsLatestPhotosResponse> {
  return nasaFetch<MarsLatestPhotosResponse>(
    `/mars-photos/api/v1/rovers/${rover}/latest_photos`,
    apiKey,
    options
  );
}

/**
 * Near Earth Object Web Service (NeoWs)
 * Endpoint: GET /neo/rest/v1/feed
 */
export function fetchAsteroids(
  apiKey: string,
  startDate: string,
  endDate: string,
  options?: FetchOptions
): Promise<NeoWsResponse> {
  return nasaFetch<NeoWsResponse>('/neo/rest/v1/feed', apiKey, {
    ...options,
    params: { start_date: startDate, end_date: endDate },
  });
}

/**
 * Retrieve current rate-limit state for monitoring.
 */
export function getRateLimits(): Record<string, RateLimitState> {
  return { ...rateLimits };
}
