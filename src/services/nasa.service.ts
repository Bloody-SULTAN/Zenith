// ──────────────────────────────────────────────
// NASA API Service — Project Zenith
// ──────────────────────────────────────────────
// Central fetch utility for all NASA APIs.
// Handles: error normalization, rate-limit detection,
// localStorage caching, and AbortController integration.

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
const CACHE_PREFIX = 'zenith_api_';

// ── localStorage Cache ──────────────────────

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

function getCached<T>(cacheKey: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > ttl) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache<T>(cacheKey: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

// ── Rate-limit tracking ─────────────────────

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
 * - Checks localStorage cache before making network requests
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

  // Check cache before making a network request
  const cacheTTL = options.cacheTTL ?? 0;
  const cacheKey = CACHE_PREFIX + url.pathname + url.search;

  if (cacheTTL > 0) {
    const cached = getCached<T>(cacheKey, cacheTTL);
    if (cached) return cached;
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

  const data = await response.json() as T;

  // Cache successful responses
  if (cacheTTL > 0) {
    setCache(cacheKey, data);
  }

  return data;
}

// ── Public API Methods ───────────────────────

const ONE_DAY = 24 * 60 * 60 * 1000;
const SIX_HOURS = 6 * 60 * 60 * 1000;

/**
 * Astronomy Picture of the Day
 * Endpoint: GET /planetary/apod
 * Cache: 24 hours (APOD changes once per day)
 */
export function fetchAPOD(
  apiKey: string,
  options?: FetchOptions
): Promise<APODResponse> {
  return nasaFetch<APODResponse>('/planetary/apod', apiKey, {
    ...options,
    cacheTTL: options?.cacheTTL ?? ONE_DAY,
  });
}

/**
 * Mars Rover Photos
 * Endpoint: GET /mars-photos/api/v1/rovers/{rover}/photos
 * Cache: 6 hours (photos for a given query are static)
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
    { ...options, params: cleanParams, cacheTTL: options?.cacheTTL ?? SIX_HOURS }
  );
}

/**
 * Mars Rover Latest Photos (no sol required — always returns data)
 * Endpoint: GET /mars-photos/api/v1/rovers/{rover}/latest_photos
 * Cache: 6 hours
 */
export function fetchLatestMarsPhotos(
  apiKey: string,
  rover: string,
  options?: FetchOptions
): Promise<MarsLatestPhotosResponse> {
  return nasaFetch<MarsLatestPhotosResponse>(
    `/mars-photos/api/v1/rovers/${rover}/latest_photos`,
    apiKey,
    { ...options, cacheTTL: options?.cacheTTL ?? SIX_HOURS }
  );
}

/**
 * Near Earth Object Web Service (NeoWs)
 * Endpoint: GET /neo/rest/v1/feed
 * Cache: 24 hours (NEO data for a date range is static)
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
    cacheTTL: options?.cacheTTL ?? ONE_DAY,
  });
}

/**
 * Retrieve current rate-limit state for monitoring.
 */
export function getRateLimits(): Record<string, RateLimitState> {
  return { ...rateLimits };
}
